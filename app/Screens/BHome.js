import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../supabase';

// PNG ICONS
import CoffeeIcon from '../assets/icons/Coffee.png';
import CustomersIcon from '../assets/icons/Customers.png';
import GiftIcon from '../assets/icons/Gift.png';
import RewardIcon from '../assets/icons/Reward.png';
import VisitsIcon from '../assets/icons/Visits.png';

const stats = [
  {
    label: 'Visits today',
    icon: VisitsIcon,
    colors: ['#F1EDFF', '#E8E1FF'],
    border: '#D8CEFA',
    numColor: '#17105C',
    labelColor: '#6358B8',
    arrowBg: '#DCD3FA',
    arrowColor: '#5547B7',
  },
  {
    label: 'Rewards',
    icon: RewardIcon,
    colors: ['#EBFAF2', '#E0F6E9'],
    border: '#CBE9D5',
    numColor: '#07553E',
    labelColor: '#438C70',
    arrowBg: '#CDE8D6',
    arrowColor: '#3A956B',
  },
  {
    label: 'Customers',
    icon: CustomersIcon,
    colors: ['#EDF5FF', '#E3EEFF'],
    border: '#D0E1FA',
    numColor: '#102E72',
    labelColor: '#4C73AF',
    arrowBg: '#D4E4FA',
    arrowColor: '#4774B9',
  },
  {
    label: 'Return rate',
    icon: null,
    materialIcon: 'show-chart',
    colors: ['#FFF5E8', '#FFEDD8'],
    border: '#F8DDBD',
    numColor: '#713514',
    labelColor: '#A16B42',
    arrowBg: '#F5DFC3',
    arrowColor: '#A86B35',
  },
];

// ==================================================
// BHOME
// ==================================================

const BHome = ({ navigation }) => {
  const { user, businessId } = useSelector((state) => state.home);
  const [status, setStatus] = useState('checking'); // 'checking' | 'no-profile' | 'no-card' | 'ready'
  const [businessOffers, setBusinessOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
  'Visits today': 0,
  Rewards: 0,
  Customers: 0,
  'Return rate': '0%',
});

const [purchaseRecords, setPurchaseRecords] = useState([]);
const [recentActivity, setRecentActivity] = useState([]);
const [loadingDashboard, setLoadingDashboard] = useState(true);

const [selectedStat, setSelectedStat] = useState(null);
useEffect(() => {
  let isMounted = true;

  const fetchDashboardData = async () => {
    if (!businessId) {
      setPurchaseRecords([]);
      setRecentActivity([]);
      setDashboardStats({
        'Visits today': 0,
        Rewards: 0,
        Customers: 0,
        'Return rate': '0%',
      });
      setLoadingDashboard(false);
      return;
    }

    setLoadingDashboard(true);

    try {
      // Aaj ki local date ki boundaries
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      // Business ki actual purchase/visit history
      const { data: purchases, error: purchaseError } =
        await supabase
          .from('purchase_record')
          
.select(
  'id, business_id, customer_id, total_amount, points_earned, stamps_earned, rewards_earned, purchase_date, card_id, items'
)

          .eq('business_id', businessId)
          .order('purchase_date', { ascending: false })
          .limit(1000);
console.log('BUSINESS ID:', businessId);
console.log('PURCHASE RECORDS:', purchases);
console.log('PURCHASE ERROR:', purchaseError);

      if (purchaseError) {
        throw purchaseError;
      }

      const records = purchases || [];

      
      // Customer IDs from purchase records
      const customerIds = [
        ...new Set(
          records.map((item) => item.customer_id).filter(Boolean)
        ),
      ];

      // Customer profiles from Supabase Auth RPC
      let customerMap = {};

      if (customerIds.length > 0) {
        const {
          data: customers,
          error: customerError,
        } = await supabase.rpc('get_business_customer_profiles', {
          p_business_id: businessId,
        });

        if (customerError) {
          console.error('Customer profile error:', customerError.message);
        } else {
          (customers || []).forEach((customer) => {
            customerMap[customer.customer_id] = customer;
          });
        }
      }

      // Card details for the purchases
      const cardIds = [
        ...new Set(
          records.map((item) => item.card_id).filter(Boolean)
        ),
      ];

      let cardMap = {};

      if (cardIds.length > 0) {
        const { data: cards, error: cardsError } = await supabase
          .from('card')
          .select('card_id, card_type, card_config')
          .in('card_id', cardIds);

        if (cardsError) {
          console.error('Card fetch error:', cardsError.message);
        } else {
          (cards || []).forEach((card) => {
            cardMap[card.card_id] = card;
          });
        }
      }

      // Aaj ki visits
      const todaysRecords = records.filter((item) => {
        if (!item.purchase_date) return false;

        const date = new Date(item.purchase_date);

        return (
          date >= startOfDay &&
          date < startOfTomorrow
        );
      });

      // Har customer ki total visits
     
const visitCounts = {};
const visitNumberByRecordId = {};

// Oldest purchase se newest purchase tak numbering
[...records].reverse().forEach((item) => {
  if (!item.customer_id) return;

  visitCounts[item.customer_id] =
    (visitCounts[item.customer_id] || 0) + 1;

  visitNumberByRecordId[item.id] =
    visitCounts[item.customer_id];
});

const uniqueCustomerIds = Object.keys(visitCounts);

const returningCustomers = uniqueCustomerIds.filter(
  (id) => visitCounts[id] > 1
).length;

const totalRewards = records.reduce(
  (sum, item) => sum + (Number(item.rewards_earned) || 0),
  0
);
const returnRate = uniqueCustomerIds.length > 0
  ? Math.round(
      (returningCustomers / uniqueCustomerIds.length) * 100
    )
  : 0;

  
// const cardIds = [
//   ...new Set(
//     records.map((item) => item.card_id).filter(Boolean)
//   ),
// ];

// let cardMap = {};

// if (cardIds.length > 0) {
//   const { data: cards, error: cardsError } = await supabase
//     .from('card')
//     .select('card_id, card_type, card_config')
//     .in('card_id', cardIds);

//   if (cardsError) {
//     console.error('Dashboard card fetch error:', cardsError);
//     throw cardsError;
//   }

//   (cards || []).forEach((card) => {
//     cardMap[card.card_id] = card;
//   });
// }

      // Recent activity mein real customer details
      const activity = records.slice(0, 10).map((item) => {
        const customer = customerMap[item.customer_id];

        const name =
          customer?.full_name ||
          customer?.phone ||
          customer?.email ||
          'Registered customer';

        const initials = name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join('');

        const purchaseTime = item.purchase_date
          ? new Date(item.purchase_date)
          : null;

        let time = 'Time unavailable';

        if (purchaseTime && !Number.isNaN(purchaseTime.getTime())) {
          const minutes = Math.max(
            0,
            Math.floor((now - purchaseTime) / 60000)
          );

          if (minutes < 1) {
            time = 'Just now';
          } else if (minutes < 60) {
            time = `${minutes}m ago`;
          } else if (minutes < 1440) {
            time = `${Math.floor(minutes / 60)}h ago`;
          } else {
            time = `${Math.floor(minutes / 1440)}d ago`;
          }
        }

const card = cardMap[item.card_id];
const cardType = String(card?.card_type || '').toLowerCase();

let displayValue;

if (cardType.includes('point')) {
  displayValue = `Points: ${Number(item.points_earned) || 0}`;
} else if (cardType.includes('stamp')) {
  displayValue = `Stamps: ${Number(item.stamps_earned) || 0}`;
} else {
  displayValue = `Amount: Rs. ${Number(item.total_amount || 0).toLocaleString()}`;
}

        return {
          ...item,
          name,
          initials: initials || 'C',
          visit: `Visit #${visitNumberByRecordId[item.id] || 1}`,
            displayValue,
          reward: Number(item.rewards_earned) > 0,
          time,
          colors: ['#7C3AED', '#A78BFA'],
        };
      });

      if (!isMounted) return;

      setPurchaseRecords(records);
      setRecentActivity(activity);

      setDashboardStats({
        'Visits today': todaysRecords.length,
        Rewards: totalRewards,
        Customers: uniqueCustomerIds.length,
        'Return rate': `${returnRate}%`,
      });
    } catch (error) {
      console.log(
        'Dashboard fetch error:',
        error?.message || error
      );
    } finally {
      if (isMounted) {
        setLoadingDashboard(false);
      }
    }
  };

  fetchDashboardData();

  return () => {
    isMounted = false;
  };
}, [businessId]);

  // CARD CHECK

useEffect(() => {
  let isMounted = true;

  const checkCard = async () => {
    setStatus('checking');

    if (!businessId) {
      // Business ID abhi Redux mein available nahi.
      // Is waqt missing profile ka final decision na karo.
      setStatus('checking');
      return;
    }

    const { data, error } = await supabase
      .from('card')
      .select('card_id')
      .eq('business_id', businessId)
      .limit(1);

    if (!isMounted) return;

    if (error) {
      console.log('CARD CHECK ERROR:', error.message);

      // Query fail hui hai to banner ko ghalat
      // tareeqe se "Generate card" mat dikhao.
      setStatus('checking');
      return;
    }

    setStatus(data && data.length > 0 ? 'ready' : 'no-card');
  };

  checkCard();

  return () => {
    isMounted = false;
  };
}, [businessId]);



// OFFERS
useEffect(() => {
  const fetchMyOffers = async () => {
    if (!businessId) {
      setBusinessOffers([]);
      setLoadingOffers(false);
      return;
    }

    setLoadingOffers(true);

    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    console.log('BHOME OFFERS:', data);
    console.log('BHOME OFFERS ERROR:', error);

    if (error) {
      setBusinessOffers([]);
    } else {
      setBusinessOffers(data || []);
    }

         setLoadingOffers(false);
  };

  fetchMyOffers();
}, [businessId]);

  // offer ka badge: approval_status aur is_active dono independent hain
  const getOfferStatusStyle = (offer) => {
    if (offer.approval_status === 'approved' && offer.is_active) {
      return { label: 'Active', color: '#16A34A', bg: '#ECFDF3', border: '#B7E9C8' };
    }
    if (offer.approval_status === 'approved' && !offer.is_active) {
      return { label: 'Approved · Inactive', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' };
    }
    if (offer.approval_status === 'rejected') {
      return { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
    }
    return { label: 'Pending', color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' };
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F8F6FF',
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* ============================================
          BACKGROUND DECORATIVE GLOW
      ============================================ */}

      <View
        style={{
          position: 'absolute',
          width: 210,
          height: 210,
          left: -110,
          top: 260,
          borderRadius: 999,
          backgroundColor: 'rgba(139,92,246,0.045)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          right: -130,
          top: 440,
          borderRadius: 999,
          backgroundColor: 'rgba(139,92,246,0.045)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          width: 190,
          height: 190,
          left: -100,
          bottom: 40,
          borderRadius: 999,
          backgroundColor: 'rgba(139,92,246,0.045)',
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* ============================================
            HEADER
        ============================================ */}

        <LinearGradient
          colors={['#FFFFFF', '#FAF8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 55,
            paddingBottom: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#8B5CF6',
            shadowOpacity: 0.08,
            shadowRadius: 18,
            shadowOffset: {
              width: 0,
              height: 5,
            },
            elevation: 3,
          }}
        >
          {/* GOOD MORNING */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
              }}
            />

            <Text
              style={{
                fontSize: 13,
                color: '#9CA3AF',
              }}
            >
              Good morning
            </Text>
          </View>

          {/* TITLE */}

          <Text
            style={{
              fontSize: 25,
              fontWeight: '700',
              marginTop: 4,
            }}
          >
            <Text
              style={{
                color: '#25203A',
              }}
            >
              Smart Visit{' '}
            </Text>

            <Text
              style={{
                color: '#C95F87',
              }}
            >
              Rewards
            </Text>
          </Text>
        </LinearGradient>

        {/* ============================================
            MAIN CONTENT
        ============================================ */}

        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 12,
          }}
        >

          {/* ============================================
              COMPLETE PROFILE BANNER
          ============================================ */}

          {(status === 'no-profile' || status === 'no-card') && (
            <TouchableOpacity
              onPress={() => navigation.navigate('CardSetup')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FFF4E9', '#FFE5C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  minHeight: 50,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  padding: 16, marginBottom: 22,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  gap: 12,
                  borderColor: 'rgba(234,88,12,0.12)',
                  shadowColor: '#EA580C',
                  shadowOpacity: 0.18,
                  shadowRadius: 14,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  elevation: 5,
                }}
              >
                <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#EA580C', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 }}>
                  <Image
                    source={GiftIcon}
                    style={{
                      width: 28,
                      height: 28,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: '#9A3412', fontSize: 14 }}>
                    {status === 'no-profile' ? 'Business profile missing' : 'Generate your reward card first'}
                  </Text>
                  <Text style={{ color: '#B45309', fontSize: 12, marginTop: 2 }}>
                    {status === 'no-profile' ? 'Please contact support' : 'Set up your card to start collecting visits'}
                  </Text>
                </View>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#EA580C', justifyContent: 'center', alignItems: 'center', shadowColor: '#EA580C', shadowOpacity: 0.35, shadowRadius: 8, elevation: 3 }}>
                  <MaterialIcons
                    name="arrow-forward"
                    size={17}
                    color="#FFFFFF"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* ============================================
              STATS GRID
          ============================================ */}

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}
          >

            {stats.map((item, index) => (
             <TouchableOpacity
  key={index}
  activeOpacity={0.8}
  onPress={() => {
    if (item.label === 'Visits today') {
      navigation.navigate('CustomerVisits');
    } else if (item.label === 'Rewards') {
      navigation.navigate('BusinessRewards');
    } else if (item.label === 'Customers') {
      navigation.navigate('CustomerDetails');
    } else if (item.label === 'Return rate') {
      navigation.navigate('CustomerVisits');
    }
  }}
  style={{
    width: '48.5%',
    marginBottom: 9,
  }}
>
  <LinearGradient
    colors={item.colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      width: '100%',
      height: 92,
      borderRadius: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: item.border,
      overflow: 'hidden',
      shadowColor: '#8B6DE8',
      shadowOpacity: 0.09,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 3,
    }}
  >

                {/* ICON */}

                <View
                  style={{
                    height: 38,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  {item.icon ? (
                    <Image
                      source={item.icon}
                      style={{
                        width: 43,
                        height: 43,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialIcons
                      name={item.materialIcon}
                      size={43}
                      color="#E8751A"
                    />
                  )}
                </View>

                {/* NUMBER */}

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '800',
                    marginTop: 1,
                    color: item.numColor,
                  }}
                >
                  {loadingDashboard
  ? '...'
  : String(dashboardStats[item.label] ?? 0)}
                </Text>

                {/* LABEL */}

                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '500',
                    marginTop: 1,
                    color: item.labelColor,
                  }}
                >
                  {item.label}
                </Text>

                {/* ARROW */}

                <View
                  style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 9,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: item.arrowBg,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons
                    name="arrow-forward"
                    size={14}
                    color={item.arrowColor}
                  />
                </View>

              </LinearGradient>
              </TouchableOpacity>
            ))}

          </View>

          {/* ============================================
              ACTIVE OFFERS HEADER
          ============================================ */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 1,
              marginBottom: 9,
              paddingHorizontal: 2,
            }}
          >

            <Text
              style={{
                fontSize: 13,
                fontWeight: '800',
                color: '#17152D',
              }}
            >
              Active Offers
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CreateOffers')}
            >
              <LinearGradient
                colors={['#9B6AF3', '#7545D8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 25,
                  paddingHorizontal: 11,
                  borderRadius: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#7C3AED',
                  shadowOpacity: 0.22,
                  shadowRadius: 9,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  elevation: 4,
                }}
              >
                <MaterialIcons
                  name="add"
                  size={15}
                  color="#FFFFFF"
                />

                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 8,
                    fontWeight: '700',
                    marginLeft: 3,
                  }}
                >
                  Create Offer
                </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>

                  {/* ============================================
              OFFER CARDS (ab real data — businessOffers)
          ============================================ */}

          {loadingOffers ? (
            <ActivityIndicator
              size="small"
              color="#7C3AED"
              style={{ marginVertical: 16 }}
            />
          ) : businessOffers.length === 0 ? (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 13,
                padding: 16,
                marginBottom: 9,
                alignItems: 'center',
                shadowColor: '#8B7BB8',
                shadowOpacity: 0.07,
                shadowRadius: 13,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: '#9CA3AF',
                  textAlign: 'center',
                }}
              >
                No offers created yet. Tap "Create Offer" above to add one.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 4 }}
            >
              {businessOffers.map((offer) => {
                const badge = getOfferStatusStyle(offer);

                return (
                  <View
                    key={offer.offer_id}
                    style={{
                      width: 230,
                      marginRight: 10,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 13,
                      paddingHorizontal: 10,
                      paddingTop: 8,
                      paddingBottom: 8,
                      shadowColor: '#8B7BB8',
                      shadowOpacity: 0.07,
                      shadowRadius: 13,
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      elevation: 2,
                    }}
                  >
                    {/* OFFER TOP */}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {/* ICON / IMAGE */}

                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          overflow: 'hidden',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#F5F3FF',
                        }}
                      >
                        {offer.image_url ? (
                          <Image
                            source={{ uri: offer.image_url }}
                            style={{
                              width: 42,
                              height: 42,
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Image
                            source={CoffeeIcon}
                            style={{
                              width: 42,
                              height: 42,
                            }}
                            resizeMode="contain"
                          />
                        )}
                      </View>

                      {/* OFFER INFO */}

                      <View
                        style={{
                          flex: 1,
                          marginLeft: 7,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 9,
                              fontWeight: '800',
                              color: '#28233D',
                            }}
                            numberOfLines={1}
                          >
                            {offer.title}
                          </Text>

                          {/* STATUS */}

                          <View
                            style={{
                              borderRadius: 8,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderWidth: 0.5,
                              marginLeft: 5,
                              backgroundColor: badge.bg,
                              borderColor: badge.border,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 6.5,
                                fontWeight: '800',
                                color: badge.color,
                              }}
                            >
                              {badge.label}
                            </Text>
                          </View>

                          {/* EDIT BUTTON */}

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('CreateOffers', { offer })
                            }
                            style={{
                              marginLeft: 6,
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: '#F5F3FF',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <MaterialIcons
                              name="edit"
                              size={11}
                              color="#7C3AED"
                            />
                          </TouchableOpacity>
                        </View>

                        <Text
                          style={{
                            fontSize: 7,
                            color: '#858493',
                            marginTop: 3,
                          }}
                          numberOfLines={1}
                        >
                          {offer.description}
                        </Text>

                        {/* EXPIRY */}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}
                        >
                          <MaterialIcons
                            name="access-time"
                            size={12}
                            color="#9CA3AF"
                          />

                          <Text
                            style={{
                              fontSize: 7,
                              color: '#9CA3AF',
                              marginLeft: 3,
                            }}
                          >
                            {offer.expiry_date
                              ? `Expires ${offer.expiry_date}`
                              : 'No expiry set'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          
          {/* RECENT ACTIVITY */}

          <Text
            style={{
              fontSize: 13,
              fontWeight: '800',
              color: '#17152D',
              marginTop: 9,
              marginBottom: 9,
            }}
          >
            Recent Activity
          </Text>

          {loadingDashboard ? (
            <ActivityIndicator
              size="small"
              color="#7C3AED"
              style={{ marginVertical: 16 }}
            />
          ) : recentActivity.length === 0 ? (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 13,
                padding: 18,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#858493', fontSize: 12 }}>
                No customer visits recorded yet.
              </Text>
            </View>
          ) : (
            recentActivity.map((item, index) => (
              <View
                key={item.id || index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 13,
                  padding: 10,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#8B7BB8',
                  shadowOpacity: 0.06,
                  shadowRadius: 11,
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  elevation: 2,
                }}
              >
                {/* AVATAR */}
                <LinearGradient
                  colors={item.colors}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: '800',
                    }}
                  >
                    {item.initials}
                  </Text>
                </LinearGradient>

                {/* ACTIVITY INFO */}
                <View
                  style={{
                    flex: 1,
                    marginLeft: 9,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: '#28233D',
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: '#9CA3AF',
                      marginTop: 2,
                    }}
                  >
                    {item.visit}
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: '#858493',
                      marginTop: 3,
                    }}
                  >
                {item.displayValue}
                  </Text>
                </View>

                {/* RIGHT SIDE */}
                <View style={{ alignItems: 'flex-end' }}>
                  {item.reward && (
                    <View
                      style={{
                        backgroundColor: '#F0FDF4',
                        borderRadius: 8,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderWidth: 0.5,
                        borderColor: '#BBF7D0',
                      }}
                    >
                      <Text
                        style={{
                          color: '#16A34A',
                          fontSize: 7,
                          fontWeight: '800',
                        }}
                      >
                        Reward
                      </Text>
                    </View>
                  )}

                  <Text
                    style={{
                      fontSize: 7,
                      color: '#9CA3AF',
                      marginTop: 3,
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            ))
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default BHome;