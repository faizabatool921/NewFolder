
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';

import RewardCard from '../components/RewardCard';
import { supabase } from '../supabase';

const numberValue = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const positiveValue = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// CardSetup mein "points" stamp/visit card hai.
// "amount" amount-spend/points card hai.
const isStampCardType = (cardType) => {
  const type = String(cardType || 'points')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

  return [
    'points',
    'stamp',
    'stamps',
    'stamp_card',
    'stamps_card',
    'visit',
    'visit_card',
  ].includes(type);
};

const Reward = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let channel = null;

      const loadRewards = async () => {
        try {
          setLoading(true);
          setErrorMsg('');

          // 1. Logged-in customer ki ID.
          const {
            data: authData,
            error: authError,
          } = await supabase.auth.getUser();

          if (authError) throw authError;

          const customerId = authData?.user?.id;

          if (!customerId) {
            if (active) {
              setRewards([]);
              setErrorMsg('Please log in to view your rewards.');
            }
            return;
          }

          // 2. Saare approved aur active loyalty cards.
          // Yahan business_id par limit nahi lagani.
          const { data: cards, error: cardsError } =
            await supabase
              .from('card')
              .select('*')
              .eq('approval_status', 'approved')
              .eq('is_active', true)
              .order('created_at', { ascending: false });

          if (cardsError) throw cardsError;

          if (!cards || cards.length === 0) {
            if (active) setRewards([]);
            return;
          }

          // 3. In cards ke unique business IDs.
          const businessIds = [
            ...new Set(
              cards
                .map((card) => card.business_id)
                .filter(Boolean)
            ),
          ];

          // 4. Business names load karein.
          const { data: businesses, error: businessError } =
            await supabase
              .from('business')
              .select('business_id, business_name')
              .in('business_id', businessIds);

          if (businessError) throw businessError;

          const businessMap = new Map(
            (businesses || []).map((business) => [
              business.business_id,
              business.business_name,
            ])
          );

          // 5. Current customer ki purchase history.
          const { data: purchases, error: purchaseError } =
            await supabase
              .from('purchase_record')
              .select(
                'business_id, customer_id, points_earned, stamps_earned, rewards_earned, purchase_date'
              )
              .eq('customer_id', customerId)
              .order('purchase_date', { ascending: false });

          if (purchaseError) throw purchaseError;

          const purchaseRows = purchases || [];

          // Business-wise totals calculate karein.
          const purchaseMap = new Map();

          businessIds.forEach((businessId) => {
            const rows = purchaseRows.filter(
              (row) => row.business_id === businessId
            );

            purchaseMap.set(businessId, {
              stamps: rows.reduce(
                (sum, row) =>
                  sum + numberValue(row.stamps_earned),
                0
              ),

              points: rows.reduce(
                (sum, row) =>
                  sum + numberValue(row.points_earned),
                0
              ),

              rewards: rows.reduce(
                (sum, row) =>
                  sum + numberValue(row.rewards_earned),
                0
              ),

              lastPurchase:
                rows[0]?.purchase_date || null,
            });
          });

          // 6. Har card ka apna preview aur settings.
          const rewardCards = cards
            .filter((card) => businessMap.has(card.business_id))
            .map((card) => {
              const cfg = card.card_config || {};
              const cardType = card.card_type || 'points';
              const isStampCard = isStampCardType(cardType);

              const totals = purchaseMap.get(
                card.business_id
              ) || {
                stamps: 0,
                points: 0,
                rewards: 0,
                lastPurchase: null,
              };

              const stampsPerVisit = positiveValue(
                cfg.stampsPerVisit ??
                  cfg.stamps_per_visit ??
                  card.stamps_per_visit,
                1
              );

              const expiryDays = positiveValue(
                card.expiry_days ??
                  card.expiray_days ??
                  cfg.expiryDays ??
                  cfg.expiry_days,
                180
              );

              const minimumSpend = numberValue(
                isStampCard
                  ? cfg.minSpend ??
                      cfg.minimumSpend ??
                      card.minimum_spend
                  : cfg.minSpendAmt ??
                      cfg.minimumSpend ??
                      cfg.minSpend ??
                      card.minimum_spend,
                0
              );

              const rsPerPoint = positiveValue(
                cfg.rsPerPoint ??
                  cfg.ptsPerRs ??
                  cfg.rs_per_point,
                100
              );

              const rewardThreshold = positiveValue(
                cfg.rewardThreshold ??
                  cfg.reward_threshold,
                500
              );

              const totalStamps = positiveValue(
                cfg.totalStamps ??
                  cfg.total_stamps,
                10
              );

              const target = isStampCard
                ? totalStamps
                : rewardThreshold;

              const earned = isStampCard
                ? totals.stamps
                : totals.points;

              const progress = target > 0
                ? earned % target
                : 0;

              return {
                // Har card ki unique identity.
                id: card.card_id,

                businessId: card.business_id,
                businessName:
                  businessMap.get(card.business_id) ||
                  'Business',

                points: earned,
                progress,
                total: target,

                cardType,

                bgColor:
                  card.bg_color ||
                  cfg.color ||
                  '#2e163a',

                rewardType:
                  card.reward_type ||
                  cfg.redemption ||
                  'Reward',

                logo: card.logo || null,

                rewardsEarned: totals.rewards,

                stampsPerVisit,
                minimumSpend,
                expiryDays,
                rsPerPoint,
                rewardThreshold,

                lastPurchase: totals.lastPurchase,
              };
            });

          if (active) {
            setRewards(rewardCards);
          }
        } catch (error) {
          console.log('Reward screen error:', error);

          if (active) {
            setErrorMsg(
              'Rewards could not be loaded. Please try again.'
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      loadRewards();

      // Purchase record change hone par screen refresh karein.
      channel = supabase
        .channel('customer-rewards-refresh')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_record',
          },
          () => {
            if (active) loadRewards();
          }
        )
        .subscribe();

      return () => {
        active = false;

        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }, [])
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#F5F1EC',
      }}
      contentContainerStyle={{
        padding: 15,
        paddingBottom: 30,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 6,
          color: '#2e163a',
        }}
      >
        My Rewards
      </Text>

      <Text
        style={{
          color: '#777',
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        Your loyalty cards and purchase progress
      </Text>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#6e4292"
          style={{ marginTop: 25 }}
        />
      )}

      {!loading && errorMsg !== '' && (
        <Text
          style={{
            color: '#B42318',
            marginTop: 15,
          }}
        >
          {errorMsg}
        </Text>
      )}

      {!loading &&
        !errorMsg &&
        rewards.length === 0 && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2e163a',
                marginBottom: 6,
              }}
            >
              No reward cards available
            </Text>

            <Text
              style={{
                color: '#777',
                lineHeight: 21,
              }}
            >
              Approved and active loyalty cards will
              appear here.
            </Text>
          </View>
        )}

      {!loading &&
        !errorMsg &&
        rewards.map((item) => (
          <RewardCard
            key={item.id}
            businessName={item.businessName}
            points={item.points}
            progress={item.progress}
            total={item.total}
            cardType={item.cardType}
            bgColor={item.bgColor}
            rewardType={item.rewardType}
            logo={item.logo}
            rewardsEarned={item.rewardsEarned}
            stampsPerVisit={item.stampsPerVisit}
            minimumSpend={item.minimumSpend}
            expiryDays={item.expiryDays}
            rsPerPoint={item.rsPerPoint}
            rewardThreshold={item.rewardThreshold}
          />
        ))}
    </ScrollView>
  );
};

export default Reward;
