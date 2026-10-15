import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../supabase';

const { height } = Dimensions.get('window');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// "Rs.200" / "500 pts" jaisi values se number nikalta hai
const num = (value, fallback = 0) => {
  const n = parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? fallback : n;
};

// +92 300 1234567 / 0300-1234567 dono ko 03001234567 bana deta hai
const normalizePhone = (value) => {
  let digits = (value || '').replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) digits = '0' + digits.slice(2);
  return digits;
};

const formatRs = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const getInitials = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  return (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();
};

// "15/10/2026" (DD/MM/YYYY) ko sahi Date banata hai
const parseDMY = (value) => {
  if (!value) return null;
  const m = String(value).trim().match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

// start date, expiry date aur active days teeno check hote hain

const isOfferValidToday = (offer) => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const start = parseDMY(offer.start_date);
  if (start && today < start) return false;

  const end = parseDMY(offer.expiry_date);
  if (end && today > end) return false;

  if (
    Array.isArray(offer.active_days) &&
    offer.active_days.length > 0 &&
    !offer.active_days.includes(DAY_SHORT[now.getDay()])
  ) {
    return false;
  }

  return true;
};



const computeDiscount = (offer, amount) => {
  if (!offer || amount <= 0) return 0;
  const value = Number(offer.discount_value) || 0;
  if (offer.offer_type === 'discount') return Math.min(amount, (amount * value) / 100);
  if (offer.offer_type === 'fixed') return Math.min(amount, value);
  return 0; // Buy X Get Y: free item counter par diya jata hai
};

const offerLabel = (o) => {
  const v = Number(o.discount_value) || 0;
  if (o.offer_type === 'discount') return `${v}% off`;
  if (o.offer_type === 'fixed') return `Rs. ${v} off`;
  if (o.offer_type === 'bxgy') return `Buy ${v} get 1 free`;
  return o.offer_type || 'Offer';
};

const Scanner = ({ navigation }) => {
  const { businessId } = useSelector((state) => state.home);
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState('qr');
  const [phone, setPhone] = useState('');
  const [manualAmount, setManualAmount] = useState('');

  const [permission, requestPermission] = useCameraPermissions();
  const [scanLocked, setScanLocked] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  const [offers, setOffers] = useState([]);
  const [hiddenOffers, setHiddenOffers] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [businessCards, setBusinessCards] = useState([]);
const [selectedCardId, setSelectedCardId] = useState(null);

  const [loadingOffers, setLoadingOffers] = useState(true);

  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState(null);

  // Camera permission
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Offers, products aur card rules: screen khulte hi fetch hote hain
 // Offers and card rules: screen khulte hi fetch hote hain
useFocusEffect(
  useCallback(() => {
    let active = true;

    const run = async () => {
      if (!businessId) {
        setOffers([]);
        setHiddenOffers(0);
        setCardInfo(null);
        setLoadingOffers(false);
        return;
      }

      setLoadingOffers(true);

      try {
        const [offerRes, cardRes] = await Promise.all([
          supabase
            .from('offers')
            .select('*')
            .eq('business_id', businessId)
            .eq('approval_status', 'approved')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),

          supabase
  .from('card')
  .select('*')
  .eq('business_id', businessId)
  .eq('approval_status', 'approved')
  .eq('is_active', true)
  .order('created_at', { ascending: false }),
        ]);

        if (!active) return;

        if (offerRes.error) {
          console.log('Offers fetch error:', offerRes.error.message);
        }

        if (cardRes.error) {
          console.log('Card fetch error:', cardRes.error.message);
        }

        const approved = offerRes.data || [];
        const valid = approved.filter(isOfferValidToday);

        setOffers(valid);
        setHiddenOffers(approved.length - valid.length);
        
        const cards = cardRes.data || [];

setBusinessCards(cards);

setSelectedCardId((previousId) => {
  const previousStillExists = cards.some(
    (card) => card.card_id === previousId
  );

  return previousStillExists
    ? previousId
    : cards[0]?.card_id || null;
});
      } catch (err) {
        console.log('Scanner load error:', err.message);
      } finally {
        if (active) {
          setLoadingOffers(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [businessId])
);


  // ---------- Purchase amount and offer totals ----------
const manual = parseFloat(manualAmount);
const subtotal = Number.isFinite(manual) ? Math.max(0, manual) : 0;

const discountAmount = computeDiscount(selectedOffer, subtotal);
const payable = Math.max(0, subtotal - discountAmount);

const minSpendMissing =
  !!selectedOffer &&
  Number(selectedOffer.min_spend) > 0 &&
  subtotal < Number(selectedOffer.min_spend);

  // ---------- Customer lookup ----------
 
  // ---------- Customer lookup through Edge Function ----------
  const fetchCustomerById = async (id) => {
    const { data, error } = await supabase.functions.invoke(
      'customer-lookup',
      {
        body: {
          type: 'qr',
          customer_id: id,
        },
      }
    );

    if (error) {
      console.log('QR lookup function error:', error.message);
      setErrorMsg('Customer verification failed. Please try again.');
      return null;
    }

    if (data?.error) {
      console.log('QR lookup error:', data.error);
      setErrorMsg(data.error);
      return null;
    }

    return data?.customer || null;
  };

  const fetchCustomerByPhone = async (value) => {
    const { data, error } = await supabase.functions.invoke(
      'customer-lookup',
      {
        body: {
          type: 'phone',
          phone: value.trim(),
        },
      }
    );

    if (error) {
      console.log('Phone lookup function error:', error.message);
      setErrorMsg('Customer search failed. Please try again.');
      return null;
    }

    if (data?.error) {
      console.log('Phone lookup error:', data.error);
      setErrorMsg(data.error);
      return null;
    }

    return data?.customer || null;
  };

  const unlockScanLater = () => {
    setTimeout(() => setScanLocked(false), 2000);
  };

  // ---------- QR scan ----------
  const handleBarcodeScanned = async ({ data }) => {
    if (scanLocked) return;

    setScanLocked(true);
    setErrorMsg('');

    let scannedId = null;

    try {
      const parsed = JSON.parse(data);
      if (parsed?.type === 'customer') {
        scannedId = parsed.customer_id;
      }
    } catch {
      scannedId = data;
    }

    scannedId = String(scannedId || '').trim();

    if (!UUID_RE.test(scannedId)) {
      setErrorMsg('This is not a valid SmartVisit customer QR code.');
      unlockScanLater();
      return;
    }

    setLookingUp(true);

    try {
      const found = await fetchCustomerById(scannedId);

      if (found) {
        setCustomer(found);
      } else {
        setErrorMsg((previous) =>
          previous || 'No customer found for this QR code.'
        );
        unlockScanLater();
      }
    } finally {
      setLookingUp(false);
    }
  };

  // ---------- Phone lookup ----------
  const handleFindByPhone = async () => {
    setErrorMsg('');

    if (!phone.trim()) {
      setErrorMsg('Please enter the customer phone number.');
      return;
    }

    setLookingUp(true);

    try {
      const found = await fetchCustomerByPhone(phone);

      if (!found) {
        setErrorMsg((previous) =>
          previous || 'No customer found with this phone number.'
        );
        return;
      }

      setCustomer(found);
    } finally {
      setLookingUp(false);
    }
  };


  // ---------- Confirm visit ----------
 
const handleConfirm = async () => {
  setErrorMsg('');

  if (!businessId) {
    setBusinessCards([]);
setSelectedCardId(null);
    setErrorMsg(
      'Business ID is missing. Please log in again and reopen Scanner.'
    );
    return;
  }

  if (
    !manualAmount.trim() ||
    !Number.isFinite(Number(manualAmount)) ||
    Number(manualAmount) <= 0
  ) {
    setErrorMsg(
      'Please enter a valid purchase amount greater than Rs. 0.'
    );
    return;
  }

    setConfirming(true);

    try {
      // 1. Customer
      let current = customer;
      if (!current && activeTab === 'phone' && phone.trim() !== '') {
        current = await fetchCustomerByPhone(phone);
      }
      if (!current) {
        setErrorMsg(
          activeTab === 'qr'
            ? 'Please scan the customer QR code first.'
            : 'Customer not found. Check the phone number.'
        );
        return;
      }

      // 2. Amount
     if (!Number.isFinite(Number(manualAmount)) || Number(manualAmount) <= 0) {
  setErrorMsg('Please enter a valid purchase amount greater than Rs. 0.');
  return;
}

      // 3. Offer (optional): minimum spend
      if (selectedOffer && minSpendMissing) {
        setErrorMsg(`This offer needs a minimum spend of ${formatRs(selectedOffer.min_spend)}.`);
        return;
      }

      // 4. Card rules
    const card = businessCards.find(
  (item) => item.card_id === selectedCardId
);

if (!card) {
  setErrorMsg('Please select an available reward card first.');
  return;
}

      const cfg = card.card_config || {};
      const isPoints = (card.card_type || 'points') === 'points';

      // 5. Is customer ki purani progress
    const { data: past, error: pastError } = await supabase
  .from('purchase_record')
  .select('stamps_earned, points_earned')
  .eq('business_id', businessId)
  .eq('customer_id', current.customer_id)
  .eq('card_id', selectedCardId);

      if (pastError) {
        setErrorMsg(pastError.message);
        return;
      }

      const stampsBefore = (past || []).reduce((s, r) => s + (Number(r.stamps_earned) || 0), 0);
      const pointsBefore = (past || []).reduce((s, r) => s + (Number(r.points_earned) || 0), 0);

      // 6. Stamps / points / rewards (ada kiye hue amount `payable` par)
      let stampsEarned = 0;
      let pointsEarned = 0;
      let rewardsEarned = 0;
      let cycleTotal = 0;
      let progressNow = 0;
      let note = '';

      if (isPoints) {
  // Existing card logic mein "points" type stamp-card mode hai
  cycleTotal = num(cfg.totalStamps, 10) || 10;

  const perVisit = num(cfg.stampsPerVisit, 1) || 1;
  const minSpend = num(cfg.minSpend, 0);

  if (payable < minSpend) {
    note = `Minimum spend of ${formatRs(minSpend)} was not reached, so no stamp was earned.`;
  } else {
    stampsEarned = perVisit;
  }

  const after = stampsBefore + stampsEarned;

  rewardsEarned =
    Math.floor(after / cycleTotal) -
    Math.floor(stampsBefore / cycleTotal);

  progressNow = after % cycleTotal;
} else {
  const rsPerPoint = num(cfg.rsPerPoint ?? cfg.ptsPerRs, 100) || 100;
  const minSpendAmt = num(cfg.minSpendAmt, 0);

  cycleTotal = num(cfg.rewardThreshold, 500) || 500;

  if (payable < minSpendAmt) {
    note = `Minimum spend of ${formatRs(minSpendAmt)} was not reached, so no points were earned.`;
  } else {
    pointsEarned = Math.floor(payable / rsPerPoint);
  }

  const after = pointsBefore + pointsEarned;

  rewardsEarned =
    Math.floor(after / cycleTotal) -
    Math.floor(pointsBefore / cycleTotal);

  progressNow = after % cycleTotal;
}
      


      // 7. Purchase save
      
    // 7. Purchase save
    const itemsPayload = [
      {
        type: 'purchase',
        purchase_amount: subtotal,
        amount_paid: payable,
        ...(selectedOffer
          ? {
              type_of_offer: selectedOffer.offer_type,
              offer_id: selectedOffer.offer_id,
              title: selectedOffer.title,
              discount_value: selectedOffer.discount_value,
              discount_amount: discountAmount,
            }
          : {}),
      },
    ];

   const purchasePayload = {
  business_id: businessId,
  customer_id: current.customer_id,
  card_id: selectedCardId,
  total_amount: payable,
  points_earned: pointsEarned,
  stamps_earned: stampsEarned,
  rewards_earned: rewardsEarned,
  items: itemsPayload,
};

    const { data: savedPurchase, error: insertError } =
      await supabase
        .from('purchase_record')
        .insert(purchasePayload)
        .select('id, purchase_date')
        .single();

    if (insertError) {
      console.log(
        'Purchase save error:',
        insertError.message,
        insertError.details,
        insertError.hint
      );

      setErrorMsg(
        `Purchase could not be saved: ${insertError.message}`
      );
      return;
    }

    console.log('Purchase saved successfully:', savedPurchase);


     
    // 8. Reward mila to Edge Function ke through notification bhejo
    if (rewardsEarned > 0) {
      const { data: biz, error: bizError } = await supabase
        .from('business')
        .select('business_name')
        .eq('business_id', businessId)
        .maybeSingle();

      if (bizError) {
        console.log('Business name fetch error:', bizError.message);
      }

      const bizName = biz?.business_name || 'the business';

      const rewardLabel =
        (cfg.redemption || 'Reward') +
        (isPoints && cfg.rewardProductName
          ? ` on ${cfg.rewardProductName}`
          : '');

      const notificationTitle =
        rewardsEarned > 1
          ? `${rewardsEarned} rewards unlocked! 🎁`
          : 'Reward unlocked! 🎁';

      const notificationMessage =
        `Congratulations! You earned ${rewardsEarned} ` +
        `reward${rewardsEarned > 1 ? 's' : ''} at ${bizName}: ` +
        `${rewardLabel}. Show this message to the business to claim your reward.`;

      const { data: pushResult, error: pushError } =
        await supabase.functions.invoke('send-reward-push', {
          body: {
            customer_id: current.customer_id,
            business_id: businessId,
            title: notificationTitle,
            message: notificationMessage,
          },
        });

      if (pushError) {
        console.log(
          'Reward notification function error:',
          pushError.message
        );
      } else {
        console.log('Reward notification result:', pushResult);
      }
    }

    // 8. Reward mila to Edge Function ke through notification bhejo
    if (rewardsEarned > 0) {
      const { data: biz, error: bizError } = await supabase
        .from('business')
        .select('business_name')
        .eq('business_id', businessId)
        .maybeSingle();

      if (bizError) {
        console.log('Business name fetch error:', bizError.message);
      }

      const bizName = biz?.business_name || 'the business';

      const rewardLabel =
        (cfg.redemption || 'Reward') +
        (isPoints && cfg.rewardProductName
          ? ` on ${cfg.rewardProductName}`
          : '');

      const notificationTitle =
        rewardsEarned > 1
          ? `${rewardsEarned} rewards unlocked! 🎁`
          : 'Reward unlocked! 🎁';

      const notificationMessage =
        `Congratulations! You earned ${rewardsEarned} ` +
        `reward${rewardsEarned > 1 ? 's' : ''} at ${bizName}: ` +
        `${rewardLabel}. Show this message to the business to claim your reward.`;

      const { data: pushResult, error: pushError } =
        await supabase.functions.invoke('send-reward-push', {
          body: {
            customer_id: current.customer_id,
            business_id: businessId,
            title: notificationTitle,
            message: notificationMessage,
          },
        });

      if (pushError) {
        console.log(
          'Reward notification function error:',
          pushError.message
        );
      } else {
        console.log('Reward notification result:', pushResult);
      }
    }


      setCustomer(current);
      setResult({
        subtotal,
        discount: discountAmount,
        total: payable,
        offer: selectedOffer,
        isPoints,
        stampsEarned,
        pointsEarned,
        rewardsEarned,
        cycleTotal,
        progressNow,
        note,
      });
      setVerified(true);
    } catch (err) {
      console.log('Confirm visit error:', err);
      setErrorMsg('Something went wrong while recording the visit.');
    } finally {
      setConfirming(false);
    }
  };

  const resetAll = () => {
    setVerified(false);
    setResult(null);
    setPhone('');
    setManualAmount('');
    setCustomer(null);
    setSelectedOffer(null);
    setScanLocked(false);
    setErrorMsg('');
    setActiveTab('qr');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCustomer(null);
    setScanLocked(false);
    setErrorMsg('');
  };

  const glass = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  };

  const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 };

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#2e163a', '#3e1041', '#6e4292']} style={{ minHeight: height }}>
        {/* Background circles */}
        <View
          style={{
            position: 'absolute', width: 200, height: 200, backgroundColor: '#ad92c4',
            borderRadius: 100, top: -50, left: -50, opacity: 0.2,
          }}
        />
        <View
          style={{
            position: 'absolute', width: 250, height: 250, backgroundColor: '#ad92c4',
            borderRadius: 125, bottom: -80, right: -80, opacity: 0.2,
          }}
        />

        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
            paddingTop: 55, paddingBottom: 16, gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)',
              alignItems: 'center', justifyContent: 'center', borderWidth: 0.5,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <MaterialIcons name="arrow-back" size={20} color="#c4bbf5" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Scan Customer</Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {verified && result ? (
            /* =============== SUCCESS =============== */
            <View style={glass}>
              <View style={{ alignItems: 'center', marginBottom: 18 }}>
                <View
                  style={{
                    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(52,211,153,0.15)',
                    borderWidth: 1.5, borderColor: '#34d399', alignItems: 'center',
                    justifyContent: 'center', marginBottom: 8,
                  }}
                >
                  <MaterialIcons name="check" size={30} color="#34d399" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#34d399' }}>Visit Recorded!</Text>
              </View>

              {/* Customer */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View
                  style={{
                    width: 44, height: 44, borderRadius: 22, backgroundColor: '#534AB7',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                    {getInitials(customer?.full_name)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                    {customer?.full_name || 'Customer'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    {customer?.phone || '-'}
                  </Text>
                </View>
              </View>

              {/* REWARD BANNER */}
              {result.rewardsEarned > 0 && (
                <View
                  style={{
                    backgroundColor: 'rgba(255,154,68,0.15)', borderRadius: 14, padding: 14,
                    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,154,68,0.55)',
                    flexDirection: 'row', alignItems: 'center',
                  }}
                >
                  <MaterialIcons name="card-giftcard" size={28} color="#FF9A44" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ color: '#FF9A44', fontWeight: 'bold', fontSize: 14 }}>
                      {result.rewardsEarned} reward{result.rewardsEarned > 1 ? 's' : ''} earned!
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>
                      Reward notification is being processed.
                    </Text>
                  </View>
                </View>
              )}

              {result.note !== '' && (
                <Text style={{ color: '#FFD6D6', fontSize: 11, marginBottom: 14 }}>{result.note}</Text>
              )}

              <View style={{ height: 0.5, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 14 }} />

            

              {/* Offer */}
              {result.offer && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                    Offer applied
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FF9A44', fontSize: 14, fontWeight: 'bold' }}>
                      {result.offer.title}
                    </Text>
                    {result.discount > 0 && (
                      <Text style={{ color: '#34d399', fontSize: 13, fontWeight: 'bold' }}>
                        - {formatRs(result.discount)}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Summary */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Amount paid</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 2 }}>
                    {formatRs(result.total)}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                    {result.isPoints ? 'Stamps earned' : 'Points earned'}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FF9A44', marginTop: 2 }}>
                    +{result.isPoints ? result.stampsEarned : result.pointsEarned}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Progress</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 2 }}>
                    {result.progressNow} / {result.cycleTotal}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={resetAll}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 20, padding: 14,
                  borderRadius: 15, alignItems: 'center', borderWidth: 0.5,
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>New Scan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* =============== SCAN FORM =============== */
            <View style={glass}>
              {/* Tabs */}
              <View
                style={{
                  flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: 4, marginBottom: 20,
                }}
              >
                {[
                  { id: 'qr', label: 'Scan QR' },
                  { id: 'phone', label: 'Phone No.' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => switchTab(t.id)}
                    style={{
                      flex: 1, padding: 10, borderRadius: 10, alignItems: 'center',
                      backgroundColor: activeTab === t.id ? '#3e1041' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.45)',
                        fontWeight: 'bold', fontSize: 13,
                      }}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ---- QR TAB ---- */}
              {activeTab === 'qr' && (
                <View>
                  {customer ? (
                    <View
                      style={{
                        backgroundColor: 'rgba(52,211,153,0.12)', borderRadius: 14, padding: 14,
                        marginBottom: 16, borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.4)',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="check-circle" size={22} color="#34d399" />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={{ color: '#34d399', fontWeight: 'bold', fontSize: 14 }}>
                            {customer.full_name || 'Customer'}
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>
                            {customer.phone || 'QR scanned successfully'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => { setCustomer(null); setScanLocked(false); }}
                        style={{ marginTop: 10, alignSelf: 'flex-start' }}
                      >
                        <Text style={{ color: '#FF9A44', fontSize: 12, fontWeight: 'bold' }}>
                          Scan a different customer
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          height: 260, backgroundColor: '#000', borderRadius: 16, overflow: 'hidden',
                          marginBottom: 12, borderWidth: 1.5, borderColor: 'rgba(255,154,68,0.5)',
                        }}
                      >
                        {Platform.OS === 'web' ? (
                          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                            <MaterialIcons name="smartphone" size={46} color="rgba(255,154,68,0.7)" />
                            <Text style={{ color: '#fff', marginTop: 10, textAlign: 'center', fontSize: 13 }}>
                              QR scanning works on the phone (Expo Go). In the browser, use the Phone No. tab.
                            </Text>
                          </View>
                        ) : permission?.granted ? (
                          isFocused && (
                            <CameraView
                              style={{ flex: 1 }}
                              facing="back"
                              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                              onBarcodeScanned={scanLocked ? undefined : handleBarcodeScanned}
                            />
                          )
                        ) : (
                          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                            <MaterialIcons name="qr-code-scanner" size={55} color="rgba(255,154,68,0.6)" />
                            <Text style={{ color: '#fff', marginTop: 10, textAlign: 'center', fontSize: 13 }}>
                              Camera permission is required
                            </Text>
                            <TouchableOpacity
                              onPress={requestPermission}
                              style={{
                                marginTop: 15, backgroundColor: '#FF9A44', paddingHorizontal: 18,
                                paddingVertical: 10, borderRadius: 10,
                              }}
                            >
                              <Text style={{ color: '#2e163a', fontWeight: 'bold', fontSize: 12 }}>Allow Camera</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {lookingUp && (
                          <View
                            style={{
                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <ActivityIndicator color="#FF9A44" />
                          </View>
                        )}

                        {/* Corners */}
                        <View style={{ position: 'absolute', top: 15, left: 15, width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#FF9A44' }} />
                        <View style={{ position: 'absolute', top: 15, right: 15, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#FF9A44' }} />
                        <View style={{ position: 'absolute', bottom: 15, left: 15, width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#FF9A44' }} />
                        <View style={{ position: 'absolute', bottom: 15, right: 15, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#FF9A44' }} />
                      </View>

                      <Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 16 }}>
                        Point camera at customer's QR code
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* ---- PHONE TAB ---- */}
              {activeTab === 'phone' && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={labelStyle}>Enter customer phone number</Text>

                  <View
                    style={{
                      flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                      borderRadius: 12, paddingHorizontal: 10,
                    }}
                  >
                    <FontAwesome name="phone" size={20} color="black" />
                    <TextInput
                      placeholder="e.g. 03001234567"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={(t) => { setPhone(t); setCustomer(null); }}
                      style={{ flex: 1, height: 50, marginLeft: 10 }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleFindByPhone}
                    disabled={lookingUp}
                    style={{
                      marginTop: 10, backgroundColor: 'rgba(255,255,255,0.1)', padding: 12,
                      borderRadius: 12, alignItems: 'center', borderWidth: 0.5,
                      borderColor: 'rgba(255,255,255,0.2)', opacity: lookingUp ? 0.6 : 1,
                    }}
                  >
                    {lookingUp ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Find Customer</Text>
                    )}
                  </TouchableOpacity>

                  {customer && (
                    <View
                      style={{
                        flexDirection: 'row', alignItems: 'center', marginTop: 10,
                        backgroundColor: 'rgba(52,211,153,0.12)', borderRadius: 12, padding: 12,
                        borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.4)',
                      }}
                    >
                      <MaterialIcons name="check-circle" size={20} color="#34d399" />
                      <Text style={{ color: '#34d399', fontSize: 13, marginLeft: 8, fontWeight: 'bold' }}>
                        {customer.full_name || 'Customer'} found
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={{ height: 0.5, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />

{/* ---- SELECT REWARD CARD ---- */}
<Text style={[labelStyle, { marginTop: 4 }]}>
  Select Reward Card
</Text>

{businessCards.length === 0 ? (
  <View
    style={{
      padding: 14,
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.08)',
    }}
  >
    <Text style={{ color: '#FFD6D6', fontSize: 12 }}>
      No approved and active reward cards are available.
    </Text>
  </View>
) : (
  businessCards.map((card) => {
    const isSelected = selectedCardId === card.card_id;
    const cfg = card.card_config || {};
    const isStampCard = card.card_type === 'points';

    return (
      <TouchableOpacity
        key={card.card_id}
        onPress={() => {
          setSelectedCardId(card.card_id);
          setErrorMsg('');
        }}
        style={{
          padding: 14,
          marginBottom: 9,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isSelected
            ? '#FF9A44'
            : 'rgba(255,255,255,0.15)',
          backgroundColor: isSelected
            ? 'rgba(255,154,68,0.18)'
            : 'rgba(255,255,255,0.08)',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MaterialIcons
          name="card-membership"
          size={25}
          color="#FF9A44"
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {cfg.cardName ||
              cfg.name ||
              (isStampCard
                ? 'Visit / Stamp Card'
                : 'Amount / Points Card')}
          </Text>

          <Text
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 11,
              marginTop: 4,
            }}
          >
            {isStampCard
              ? `${num(cfg.totalStamps, 10)} stamps required for reward`
              : `${formatRs(num(cfg.rewardThreshold, 500))} points reward threshold`}
          </Text>
        </View>

        <MaterialIcons
          name={
            isSelected
              ? 'radio-button-checked'
              : 'radio-button-unchecked'
          }
          size={22}
          color={isSelected ? '#FF9A44' : '#fff'}
        />
      </TouchableOpacity>
    );
  })
)}


{/* ---- SELECT OFFER ---- */}
<Text style={[labelStyle, { marginTop: 4 }]}>
  Select Offer (optional)
</Text>

{loadingOffers ? (
  <ActivityIndicator color="#FF9A44" style={{ marginVertical: 12 }} />
) : offers.length === 0 ? (
  <View
    style={{
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: 14,
      marginBottom: 6,
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        textAlign: 'center',
      }}
    >
      {hiddenOffers > 0
        ? `${hiddenOffers} approved offer(s) are not valid today.`
        : 'No approved and active offers for this business.'}
    </Text>
  </View>
) : (
  <>
    <TouchableOpacity
      onPress={() => {
        setSelectedOffer(null);
        setErrorMsg('');
      }}
      style={{
        backgroundColor: !selectedOffer
          ? 'rgba(255,154,68,0.18)'
          : 'rgba(255,255,255,0.08)',
        borderColor: !selectedOffer
          ? '#FF9A44'
          : 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 13 }}>
        No offer — regular purchase
      </Text>

      <MaterialIcons
        name={!selectedOffer ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={22}
        color={!selectedOffer ? '#FF9A44' : '#fff'}
      />
    </TouchableOpacity>

    {offers.map((offer) => {
      const isSelected = selectedOffer?.offer_id === offer.offer_id;
      const needsMore =
        Number(offer.min_spend) > 0 &&
        subtotal < Number(offer.min_spend);

      return (
        <TouchableOpacity
          key={offer.offer_id}
          activeOpacity={0.85}
          onPress={() => {
            setSelectedOffer(isSelected ? null : offer);
            setErrorMsg('');
          }}
          style={{
            backgroundColor: isSelected
              ? 'rgba(255,154,68,0.18)'
              : 'rgba(255,255,255,0.08)',
            borderColor: isSelected
              ? '#FF9A44'
              : 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 13,
            marginBottom: 9,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                {offer.title}
              </Text>

              {!!offer.description && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {offer.description}
                </Text>
              )}

              <Text
                style={{
                  color: '#FF9A44',
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginTop: 6,
                }}
              >
                {offerLabel(offer)}
              </Text>

              {Number(offer.min_spend) > 0 && (
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 3,
                    color: needsMore ? '#FFB4B4' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  Minimum spend: {formatRs(offer.min_spend)}
                </Text>
              )}

              {offer.offer_type === 'bxgy' && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 11,
                    marginTop: 3,
                  }}
                >
                  Free item is given at the counter.
                </Text>
              )}
            </View>

            <MaterialIcons
              name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={22}
              color={isSelected ? '#FF9A44' : '#fff'}
            />
          </View>
        </TouchableOpacity>
      );
    })}
  </>
)}

{/* ---- PURCHASE AMOUNT ---- */}
<Text style={[labelStyle, { marginTop: 14 }]}>
  Enter Purchase Amount (Rs.)
</Text>

<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 6,
  }}
>
  <MaterialIcons name="attach-money" size={22} color="black" />

  <TextInput
    placeholder="Enter purchase amount"
    placeholderTextColor="#888"
    keyboardType="decimal-pad"
    value={manualAmount}
    onChangeText={(value) => {
      setManualAmount(value);
      setErrorMsg('');
    }}
    style={{
      flex: 1,
      height: 50,
      marginLeft: 10,
      color: '#222',
      fontSize: 15,
    }}
  />
</View>

              {/* ---- TOTALS ---- */}
              <View style={{ marginTop: 12, marginBottom: 16 }}>
                {discountAmount > 0 && (
                  <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Subtotal</Text>
                      <Text style={{ color: '#fff', fontSize: 13 }}>{formatRs(subtotal)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ color: '#34d399', fontSize: 13 }}>Offer discount</Text>
                      <Text style={{ color: '#34d399', fontSize: 13 }}>- {formatRs(discountAmount)}</Text>
                    </View>
                  </>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Total to pay</Text>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{formatRs(payable)}</Text>
                </View>
              </View>

              {errorMsg !== '' && (
                <Text style={{ color: '#FFD6D6', textAlign: 'center', marginBottom: 14, fontWeight: 'bold', fontSize: 12 }}>
                  {errorMsg}
                </Text>
              )}

              {/* CONFIRM */}
             <TouchableOpacity
  onPress={handleConfirm}
  disabled={
    confirming ||
    lookingUp ||
    !customer ||
    !manualAmount.trim() ||
    !Number.isFinite(Number(manualAmount)) ||
    Number(manualAmount) <= 0
  }
  style={{
    backgroundColor: '#3e1041',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    opacity:
      confirming ||
      lookingUp ||
      !customer ||
      !manualAmount.trim() ||
      !Number.isFinite(Number(manualAmount)) ||
      Number(manualAmount) <= 0
        ? 0.55
        : 1,
  }}
>
  {confirming ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
      Confirm Visit
    </Text>
  )}
</TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </ScrollView>
  );
};
export default Scanner;