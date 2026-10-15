import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

// ── Customer connected businesses data ────────────────────────────────────
const loyaltyCards = [
  {
    id: 1,
    businessName: 'Second Cup Café',
    icon: 'coffee',
    bgColor: '#2d1b4e',
    points: 1250,
    ptsColor: '#FFB347',
    stampsTotal: 5,
    stampsDone: 3,
    stampColor: '#FFB347',
    rule: 'Buy 5 Get 1 Free',
    isFavorite: true,
  },
  {
    id: 2,
    businessName: 'Artisan Brews',
    icon: 'shopping-bag',
    bgColor: '#1e3a5f',
    points: 620,
    ptsColor: '#34d399',
    stampsTotal: 10,
    stampsDone: 7,
    stampColor: '#c084fc',
    rule: '10 stamps = Free Latte',
    isFavorite: false,
  },
];

// ── Recent visits data ─────────────────────────────────────────────────────
const recentVisits = [
  { id: 1, shop: 'Second Cup Café', icon: 'coffee',       amount: 'Rs. 850', time: 'Today, 2:30 PM',  pts: '+85 pts'  },
  { id: 2, shop: 'Artisan Brews',   icon: 'shopping-bag', amount: 'Rs. 620', time: 'Yesterday',       pts: '+62 pts'  },
  { id: 3, shop: 'Second Cup Café', icon: 'coffee',       amount: 'Rs. 450', time: '3 days ago',      pts: '+45 pts'  },
];

const CustomerDetails = ({ navigation, route }) => {

  // Customer info passed from Visits screen via navigation
  const customer = route?.params?.customer || {
    initials: 'AK',
    name: 'Ayesha Khan',
    phone: '+92 300 1234567',
    since: 'Jan 2024',
    totalVisits: 7,
    totalPoints: 1250,
    rewardsWon: 2,
    badge: 'VIP',
    avatarColor: '#534AB7',
  };

  return (
  
  <View style={{ flex:1, backgroundColor:'#F5F5F5' }}>
    <ScrollView style={{ flex:1 }}>
        {/* Background Circles */}
        <View style={{ position:'absolute', width:200, height:200, backgroundColor:'#ad92c4', borderRadius:100, top:-50, left:-50, opacity:0.2 }} />
        <View style={{ position:'absolute', width:250, height:250, backgroundColor:'#ad92c4', borderRadius:125, bottom:-80, right:-80, opacity:0.2 }} />

        {/* Header */}
        <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingTop:55, paddingBottom:16, gap:12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width:36, height:36, borderRadius:18, backgroundColor:'#FFFFFF', alignItems:'center', justifyContent:'center', borderWidth:0.5, borderColor:'#E5E7EB' }}
          >
            <MaterialIcons name="arrow-back" size={20} color="#c4bbf5" />
          </TouchableOpacity>
          <Text style={{ fontSize:18, fontWeight:'bold', color:'#1F2937' }}>Customer Detail</Text>
        </View>

        <View style={{ paddingHorizontal:16, paddingBottom:100 }}>

          {/* ── HERO CARD ── */}
          <View style={{ backgroundColor:'#FFFFFF',
             borderRadius:18, padding:16, marginBottom:14, borderWidth:0.5, borderColor:'#E5E7EB',
              flexDirection:'row', alignItems:'center', gap:14 }}>

            {/* Avatar */}
            <View style={{ width:60, height:60, borderRadius:30, backgroundColor: customer.avatarColor, alignItems:'center', justifyContent:'center' }}>
              <Text style={{ color:'#1F2937', fontWeight:'bold', fontSize:18 }}>{customer.initials}</Text>
            </View>

            {/* Info */}
            <View style={{ flex:1 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:3 }}>
                <Text style={{ fontSize:16, fontWeight:'bold', color:'#1F2937' }}>{customer.name}</Text>
                {customer.badge ? (
                  <View style={{ backgroundColor:'rgba(37,99,235,0.25)', borderRadius:20, paddingHorizontal:8, paddingVertical:2, borderWidth:0.5, borderColor:'rgba(96,165,250,0.5)' }}>
                    <Text style={{ color:'#60a5fa', fontSize:10, fontWeight:'bold' }}>{customer.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ fontSize:12, color:'#6B7280', marginBottom:2 }}>{customer.phone}</Text>
              <Text style={{ fontSize:11, color:'#6B7280' }}>Member since {customer.since}</Text>
            </View>

          </View>

          {/* ── STATS ROW ── */}
          <View style={{ flexDirection:'row', gap:10, marginBottom:14 }}>
            <View style={{ flex:1, backgroundColor:'#FFFFFF', borderRadius:14, padding:12, alignItems:'center', borderWidth:0.5, borderColor:'#E5E7EB' }}>
              <Text style={{ fontSize:22, fontWeight:'bold', color:'#111827'}}>{customer.totalVisits}</Text>
              <Text style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>Total visits</Text>
            </View>
            <View style={{ flex:1, backgroundColor:'#FFFFFF', borderRadius:14, padding:12, alignItems:'center', borderWidth:0.5, borderColor:'#E5E7EB' }}>
              <Text style={{ fontSize:22, fontWeight:'bold', color:'#FF9A44' }}>{customer.totalPoints}</Text>
              <Text style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>Total points</Text>
            </View>
            <View style={{ flex:1, backgroundColor:'#FFFFFF', borderRadius:14, padding:12, alignItems:'center', borderWidth:0.5, borderColor:'#E5E7EB' }}>
              <Text style={{ fontSize:22, fontWeight:'bold', color:'#34d399' }}>{customer.rewardsWon}</Text>
              <Text style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>Rewards won</Text>
            </View>
          </View>

          {/* ── CONNECTED LOYALTY CARDS ── */}
          <View style={{ backgroundColor:'#FFFFFF', borderRadius:18, padding:16, marginBottom:14, borderWidth:0.5, borderColor:'rgba(255,255,255,0.15)' }}>
            <Text style={{ fontSize:14, fontWeight:'bold', color:'#1F2937', marginBottom:12 }}>Connected Loyalty Cards</Text>

            {loyaltyCards.map((card) => (
              <View
                key={card.id}
                style={{ backgroundColor: card.bgColor, borderRadius:14, padding:14, marginBottom:10 }}
              >
                {/* Card top row */}
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                    <View style={{ width:30, height:30, borderRadius:8, backgroundColor:'#FFFFFF', alignItems:'center', justifyContent:'center' }}>
                      <FontAwesome name={card.icon} size={15} color='#1F2937' />
                    </View>
                    <Text style={{ fontSize:13, fontWeight:'bold', color:'#FFFFFF'}}>{card.businessName}</Text>
                  </View>
                  {/* Favorite or gift icon */}
                  {card.isFavorite ? (
                    <View style={{ flexDirection:'row', alignItems:'center', gap:3, backgroundColor:'#F3F4F6', borderRadius:20, paddingHorizontal:7, paddingVertical:2, borderWidth:0.5, borderColor:'rgba(255,154,68,0.4)' }}>
                      <FontAwesome name="star" size={9} color="#FFB347" />
                      <Text style={{ color:'#FFB347', fontSize:9, fontWeight:'bold' }}>Favourite</Text>
                    </View>
                  ) : (
                    <FontAwesome name="gift" size={16} color="#FF9A44" />
                  )}
                </View>

                {/* Points */}
                <Text style={{ fontSize:9, color:'#6B7280', marginBottom:2 }}>Reward Points</Text>
                <Text style={{ fontSize:22, fontWeight:'bold', color: card.ptsColor, marginBottom:6 }}>
                  {card.points} pts
                </Text>

                {/* Stamps row */}
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:4, marginBottom:6 }}>
                  {[...Array(card.stampsTotal)].map((_, i) => (
                    <View
                      key={i}
                      style={{ width:16, height:16, borderRadius:8, backgroundColor: i < card.stampsDone ? card.stampColor : 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </View>

                {/* Bottom row */}
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                  <Text style={{ fontSize:10, color:'#9CA3AF' }}>{card.rule}</Text>
                  <Text style={{ fontSize:10, color:'#9CA3AF' }}>{card.stampsDone}/{card.stampsTotal}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── RECENT VISITS ── */}
          <View style={{ backgroundColor:'#FFFFFF', borderRadius:18, padding:16, marginBottom:14, borderWidth:0.5, borderColor:'#E5E7EB' }}>
            <Text style={{ fontSize:14, fontWeight:'bold', color:'#6B7280', marginBottom:12 }}>Recent Visits</Text>

            {recentVisits.map((visit, index) => (
              <View
                key={visit.id}
                style={{ flexDirection:'row', alignItems:'center', gap:10, paddingVertical:10, borderBottomWidth: index < recentVisits.length - 1 ? 0.5 : 0, borderBottomColor:'rgba(255,255,255,0.1)' }}
              >
                {/* Icon box */}
                <View style={{ width:38, height:38, borderRadius:10, backgroundColor:'#FFFFFF', alignItems:'center', justifyContent:'center' }}>
                  <FontAwesome name={visit.icon} size={18} color='#6B7280' />
                </View>

                {/* Info */}
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:13, fontWeight:'bold', color:'#1F2937' }}>{visit.shop}</Text>
                  <Text style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{visit.amount} · {visit.time}</Text>
                </View>

                {/* Points badge */}
                <View style={{ backgroundColor:'rgba(52,211,153,0.15)', borderRadius:20, paddingHorizontal:9, paddingVertical:4, borderWidth:0.5, borderColor:'rgba(52,211,153,0.4)' }}>
                  <Text style={{ color:'#34d399', fontSize:11, fontWeight:'bold' }}>{visit.pts}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
      

      </ScrollView>
    </View>
  );
};

export default CustomerDetails;