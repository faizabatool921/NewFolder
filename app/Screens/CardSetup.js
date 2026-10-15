import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';
import RewardPreview from "../components/RewardPreview";
import { supabase } from '../supabase';

const defaultConfig = {
  color: "#2E163A",
  customHex: "",
  icon: "☕",
  redemption: "Cashback",
  totalStamps: "10",
  stampsPerVisit: "1",
  minSpend: "200",
  expiryDays: "180",
  ptsPerRs: "1",
  minSpendAmt: "100",
  rewardThreshold: "500",
  expiryAmt: "365",
    rsPerPoint: "100",
  rewardProductId: "",
  rewardProductName: "",
};

const CardSetup = () => {
  const { user } = useSelector((state) => state.home);
const { businessId } = useSelector((state) => state.home);

  const [businessName, setBusinessName] = useState('');
  const [cards, setCards] = useState([]);
  const [cardType, setCardType] = useState("points");
   const [cardId, setCardId] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [hasExistingCard, setHasExistingCard] = useState(false);

  // 'view' = generated card dikha rahe hain, 'edit' = setup/edit form
  const [mode, setMode] = useState('edit');

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

 
 
const loadProfile = async (preferredCardId = null) => {
  if (!businessId) {
    setFetching(false);
    setError(
      'Business profile not found. Please log out and log in again.'
    );
    return;
  }

  try {
    setError('');

    const { data: bizData, error: bizError } = await supabase
      .from('business')
      .select('business_name')
      .eq('business_id', businessId)
      .maybeSingle();

    if (bizError) throw bizError;

    setBusinessName(bizData?.business_name || '');

    const { data: cardData, error: cardError } = await supabase
      .from('card')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (cardError) throw cardError;

    const allCards = cardData || [];
    setCards(allCards);

    if (allCards.length > 0) {
      const selectedCard =
        allCards.find(
          (card) => card.card_id === preferredCardId
        ) || allCards[0];

      setCardId(selectedCard.card_id);
      setCardType(selectedCard.card_type || 'points');

      setConfig({
        ...defaultConfig,
        ...(selectedCard.card_config || {}),
      });

      setHasExistingCard(true);
      setMode('view');
    } else {
      setCardId(null);
      setCardType('points');
      setConfig({ ...defaultConfig });
      setHasExistingCard(false);
      setMode('edit');
    }
  } catch (err) {
    console.log('CardSetup loading error:', err.message);
    setError(err.message || 'Unable to load cards.');
  } finally {
    setFetching(false);
  }
};


useEffect(() => {
  loadProfile();
}, [businessId]);


const [products, setProducts] = useState([]);

useEffect(() => {
  const loadProducts = async () => {
    if (!businessId) return;

    const { data, error } = await supabase
      .from('products')
      .select('product_id, name, price')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('Products fetch error:', error.message);
      return;
    }

    setProducts(data || []);
  };

  loadProducts();
}, [businessId]);

  const handleSave = async () => {
    setError('');
    setSuccessMsg('');
    setSaving(true);

    const displayColor = config.customHex.length === 7 ? config.customHex : config.color;

    const payload = {
      business_id: businessId,
      card_type: cardType,
      bg_color: displayColor,
      stamps_per_visit: cardType === 'points' ? parseInt(config.stampsPerVisit) || null : null,
      minimum_spend: cardType === 'points' ? parseInt(config.minSpend) || null : parseInt(config.minSpendAmt) || null,
      reward_type: config.redemption,
      expiry_days: cardType === 'points' ? parseInt(config.expiryDays) || null : parseInt(config.expiryAmt) || null,
      card_config: config, // baaki design details (icon, totalStamps, ptsPerRs, rewardThreshold)
    };

    let saveError;
let savedCardId = cardId;

if (cardId) {
  const { error } = await supabase
    .from('card')
    .update(payload)
    .eq('card_id', cardId);

  saveError = error;
} else {
  const { data, error } = await supabase
    .from('card')
    .insert(payload)
    .select('card_id')
    .single();

  saveError = error;

  if (data) {
    savedCardId = data.card_id;
    setCardId(data.card_id);
  }
}
    setSaving(false);

   if (saveError) {
  console.log('Card save error:', saveError.message);
  setError(saveError.message);
  setSaving(false);
  return;
}

setSaving(false);
setHasExistingCard(true);
setMode('view');

await loadProfile(savedCardId);

setSuccessMsg('Card saved successfully!');
  };
   
const handleConfigChange = (key, value) => {
  setConfig((prev) => ({
    ...prev,
    [key]: value,
  }));
};

 
const handleGenerateNew = () => {
  setError('');
  setSuccessMsg('');
  setCardId(null);
  setCardType('points');
  setConfig({ ...defaultConfig });
  setHasExistingCard(false);
  setMode('edit');
};
const handleSelectCard = (card) => {
  setError('');
  setSuccessMsg('');

  setCardId(card.card_id);
  setCardType(card.card_type || 'points');

  setConfig({
    ...defaultConfig,
    ...(card.card_config || {}),
  });

  setHasExistingCard(true);
  setMode('view');
};
  const handleEditCurrent = () => {
    setError('');
    setSuccessMsg('');
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setError('');
    // fetched values wapas load kar dein (unsaved changes discard)
    loadProfile();
  };

  if (fetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F4F2FB" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const displayColor = config.customHex.length === 7 ? config.customHex : config.color;

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F2FB" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      >

        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1a1a2e', marginTop: 40, marginBottom: 4 }}>
          <Text style={{ color: '#1a1a2e' }}>Reward </Text>
          <Text style={{ color: '#D4537E' }}>Card</Text>
        </Text>
        <Text style={{ color: '#9CA3AF', marginBottom: 18 }}>
          {mode === 'view'
            ? 'This is what your customers will see'
            : hasExistingCard
              ? 'Update your card design and rules'
              : 'Choose a card type and set it up for your customers'}
        </Text>

        {error !== '' && (
          <Text style={{ color: '#e11d48', textAlign: 'center', marginBottom: 12, fontWeight: '700' }}>
            {error}
          </Text>
        )}
        {successMsg !== '' && mode === 'view' && (
          <Text style={{ color: '#16A34A', textAlign: 'center', marginBottom: 12, fontWeight: '700' }}>
            {successMsg}
          </Text>
        )}
        
{/* ALL BUSINESS CARDS */}
<View
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.14)',
  }}
>
  <Text
    style={{
      fontSize: 17,
      fontWeight: '700',
      color: '#1a1a2e',
      marginBottom: 12,
    }}
  >
    My Reward Cards ({cards.length})
  </Text>

  {cards.length === 0 ? (
    <Text style={{ color: '#9CA3AF', fontSize: 13 }}>
      You have not created any reward cards yet.
    </Text>
  ) : (
    cards.map((card, index) => {
      const selected = card.card_id === cardId;
      const cfg = card.card_config || {};
      const color =
        card.bg_color || cfg.color || '#2E163A';

      return (
        <TouchableOpacity
          key={card.card_id}
          onPress={() => handleSelectCard(card)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginBottom: index === cards.length - 1 ? 0 : 10,
            borderRadius: 14,
            backgroundColor: selected ? '#F5F3FF' : '#FAFAFC',
            borderWidth: selected ? 1.5 : 1,
            borderColor: selected ? '#7C3AED' : '#E5E7EB',
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 20 }}>
              {cfg.icon || '🎁'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#1a1a2e',
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              {businessName || 'My Business'} — Card {index + 1}
            </Text>

            <Text
              style={{
                color: '#6B7280',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {card.card_type === 'points'
                ? 'Points / Stamps'
                : card.card_type === 'amount'
                  ? 'Amount Spend'
                  : card.card_type || 'Reward Card'}
            </Text>

            <Text
              style={{
                color:
                  card.approval_status === 'approved'
                    ? '#16A34A'
                    : '#D97706',
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {card.approval_status || 'Pending'}
            </Text>
          </View>

          <Feather
            name={selected ? 'check-circle' : 'chevron-right'}
            size={20}
            color={selected ? '#7C3AED' : '#9CA3AF'}
          />
        </TouchableOpacity>
      );
    })
  )}
</View>


        {/* ══════════════ VIEW MODE — generated card ══════════════ */}
        {mode === 'view' && (
          <>
            <View style={{
              backgroundColor: '#fff', borderRadius: 22, padding: 18,
              borderWidth: 1, borderColor: 'rgba(124,58,237,0.14)',
              shadowColor: '#7C3AED', shadowOpacity: 0.14, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4,
              overflow: 'hidden',
            }}>
              <LinearGradient
                colors={['#7C3AED', '#A78BFA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 4 }}
              />

              {/* Actual generated card preview */}
              <LinearGradient
                colors={[displayColor, displayColor]}
                style={{ borderRadius: 20, padding: 18, marginTop: 6 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Text style={{ fontSize: 20 }}>{config.icon}</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
                      {businessName || 'Your Business'}
                    </Text>
                  </View>
                  <Feather name="gift" size={22} color="rgba(255,255,255,0.85)" />
                </View>

                {cardType === 'points' ? (
                  <>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', marginTop: 16, fontSize: 12 }}>Reward Points</Text>
                    <Text style={{ color: '#FFB347', fontSize: 30, fontWeight: '700' }}>0</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
                      {Array.from({ length: Math.min(parseInt(config.totalStamps) || 10, 20) }).map((_, item) => (
                        <View
                          key={item}
                          style={{
                            width: 18, height: 18, borderRadius: 9,
                            marginRight: 5, marginBottom: 5,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                          }}
                        />
                      ))}
                    </View>
                    <Text style={{ color: '#fff', marginTop: 10, fontWeight: '600', fontSize: 12 }}>
                      0 / {config.totalStamps} Stamps Collected
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', marginTop: 4, fontSize: 11 }}>
                      Buy {config.totalStamps} times, get a free reward
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', marginTop: 16, fontSize: 12 }}>Total Points</Text>
                    <Text style={{ color: '#37E0A4', fontSize: 30, fontWeight: '700' }}>0 pts</Text>
                    <View style={{ marginTop: 12, height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10 }}>
                      <View style={{ width: '0%', height: 10, backgroundColor: '#37E0A4', borderRadius: 10 }} />
                    </View>
                    <Text style={{ color: '#fff', marginTop: 8, fontSize: 12 }}>
                      0 / {config.rewardThreshold} pts
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', marginTop: 4, fontSize: 11 }}>
                      Earn 1 point per Rs. {config.rsPerPoint} spent
                    </Text>
                  </>
                )}
              </LinearGradient>

              <View style={{ marginTop: 14, flexDirection: 'row', gap: 8 }}>
                <View style={{
                  backgroundColor: '#F0FDF4', borderRadius: 20,
                  paddingHorizontal: 12, paddingVertical: 5,
                  borderWidth: 0.5, borderColor: '#BBF7D0',
                }}>
                  <Text style={{ color: '#16A34A', fontSize: 11, fontWeight: '700' }}>
                    {cardType === 'points' ? 'Points / Stamps card' : 'Amount Spend card'}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: '#F5F3FF', borderRadius: 20,
                  paddingHorizontal: 12, paddingVertical: 5,
                  borderWidth: 0.5, borderColor: '#DDD6FE',
                }}>
                  <Text style={{ color: '#7C3AED', fontSize: 11, fontWeight: '700' }}>
                    {config.redemption}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <TouchableOpacity onPress={handleEditCurrent}>
              <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 18, paddingVertical: 16, marginTop: 18,
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
                  shadowColor: '#7C3AED', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
                }}
              >
                <Feather name="edit-3" size={17} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Edit This Card</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGenerateNew}
              style={{
                borderRadius: 18, paddingVertical: 15, marginTop: 12,
                borderWidth: 1.5, borderColor: '#7C3AED',
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
                backgroundColor: '#fff',
              }}
            >
              <Feather name="plus-circle" size={17} color="#7C3AED" />
              <Text style={{ color: '#7C3AED', fontWeight: '700', fontSize: 15 }}>Generate a New Card</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ══════════════ EDIT MODE — setup form ══════════════ */}
        {mode === 'edit' && (
          <>
            {/* CARD TYPE SELECTOR */}
            <View style={{
              backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 15,
              borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
              shadowColor: '#7C3AED', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3,
            }}>
              <Text style={{ fontSize: 17, fontWeight: "700", marginBottom: 15, color: '#1a1a2e' }}>
                Card Type
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={() => setCardType("points")}
                  style={{
                    width: "48%", padding: 18, borderRadius: 18,
                    backgroundColor: cardType === "points" ? "#F5F3FF" : "#F7F8FB",
                    borderWidth: cardType === "points" ? 2 : 0,
                    borderColor: "#7C3AED",
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 8 }}>🎟️</Text>
                  <Text style={{ fontWeight: "700", fontSize: 15, color: '#1a1a2e' }}>Points / Stamps</Text>
                  <Text style={{ color: "#9CA3AF", marginTop: 5, fontSize: 11 }}>Visit based loyalty</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCardType("amount")}
                  style={{
                    width: "48%", padding: 18, borderRadius: 18,
                    backgroundColor: cardType === "amount" ? "#EFF6FF" : "#F7F8FB",
                    borderWidth: cardType === "amount" ? 2 : 0,
                    borderColor: "#2563EB",
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 8 }}>💰</Text>
                  <Text style={{ fontWeight: "700", fontSize: 15, color: '#1a1a2e' }}>Amount Spend</Text>
                  <Text style={{ color: "#9CA3AF", marginTop: 5, fontSize: 11 }}>Spend based rewards</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LIVE PREVIEW + EDIT PANEL (already reusable component) */}
            <RewardPreview
              cardType={cardType}
              businessName={businessName || 'Your Business'}
              config={config}
              onChange={handleConfigChange}
            />

            {cardType === 'points' && (
              <View
                style={{
                  backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 15,
                  borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
                  shadowColor: '#7C3AED', shadowOpacity: 0.08, shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 }, elevation: 3,
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a2e' }}>Reward Product</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, marginBottom: 12 }}>
                  Stamps sirf isi product ki khareedari par milenge
                </Text>

                {products.length === 0 ? (
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                    No products yet. Add products from Profile → Manage Products. Until then every visit earns stamps.
                  </Text>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {[{ product_id: '', name: 'Any item (every visit)' }, ...products].map((p) => {
                      const selected = config.rewardProductId === p.product_id;
                      return (
                        <TouchableOpacity
                          key={p.product_id || 'any'}
                          onPress={() => {
                            handleConfigChange('rewardProductId', p.product_id);
                            handleConfigChange('rewardProductName', p.product_id ? p.name : '');
                          }}
                          style={{
                            paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
                            backgroundColor: selected ? '#7C3AED' : '#F6F7FB',
                            borderWidth: 0.5, borderColor: selected ? '#7C3AED' : '#E5E7EB',
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: selected ? '#fff' : '#6B7280' }}>
                            {p.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 18, paddingVertical: 17, marginTop: 20,
                  opacity: saving ? 0.6 : 1,
                  shadowColor: '#7C3AED', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "700", fontSize: 16 }}>
                  {saving ? 'Saving...' : hasExistingCard ? 'Update Card' : 'Generate Card'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {hasExistingCard && (
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={{
                  borderRadius: 18, paddingVertical: 15, marginTop: 12,
                  borderWidth: 1, borderColor: '#D1D5DB',
                }}
              >
                <Text style={{ textAlign: "center", color: "#6B7280", fontWeight: "700", fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </ScrollView>
    </View>
  );
};

export default CardSetup;