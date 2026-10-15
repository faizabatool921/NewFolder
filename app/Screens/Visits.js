import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const allVisits = [
  { initials:'AK', name:'Ayesha Khan',  amount:'Rs. 850',   visit:'Visit #7',  points:'+85 pts', type:'points', bg:'#534AB7', phone:'+92 300 1234567', since:'Jan 2024', totalVisits:7,  totalPoints:1250, rewardsWon:2, badge:'VIP'  },
  { initials:'SR', name:'Saad Raza',    amount:'Rs. 320',   visit:'Visit #3',  points:'+32 pts', type:'points', bg:'#1D9E75', phone:'+92 311 2345678', since:'Mar 2024', totalVisits:3,  totalPoints:320,  rewardsWon:0, badge:''     },
  { initials:'FM', name:'Fatima Malik', amount:'Rs. 1,200', visit:'Visit #10', points:'Reward!', type:'gold',   bg:'#D85A30', phone:'+92 333 3456789', since:'Nov 2023', totalVisits:10, totalPoints:2400, rewardsWon:3, badge:'VIP'  },
  { initials:'HB', name:'Hamza Butt',   amount:'Rs. 450',   visit:'Visit #1',  points:'+45 pts', type:'points', bg:'#993556', phone:'+92 321 4567890', since:'Jun 2024', totalVisits:1,  totalPoints:45,   rewardsWon:0, badge:'New'  },
  { initials:'ZA', name:'Zara Ahmed',   amount:'Rs. 600',   visit:'Visit #5',  points:'+60 pts', type:'points', bg:'#185FA5', phone:'+92 345 5678901', since:'Feb 2024', totalVisits:5,  totalPoints:800,  rewardsWon:1, badge:''     },
];

const filters = ['Today', 'This week', 'All time'];

const Visits = ({ navigation }) => {

  const [activeFilter, setActiveFilter] = useState('Today');
  const [search, setSearch] = useState('');

  const filtered = allVisits.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2e163a', '#3e1041', '#6e4292']}
        style={{ minHeight: height }}
      >
        <View style={{ position:'absolute', width:200, height:200, backgroundColor:'#ad92c4', borderRadius:100, top:-50, left:-50, opacity:0.2 }} />
        <View style={{ position:'absolute', width:250, height:250, backgroundColor:'#ad92c4', borderRadius:125, bottom:-80, right:-80, opacity:0.2 }} />

        {/* Header */}
        <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingTop:55, paddingBottom:16, gap:12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.1)', alignItems:'center', justifyContent:'center', borderWidth:0.5, borderColor:'rgba(255,255,255,0.2)' }}
          >
            <MaterialIcons name="arrow-back" size={20} color="#c4bbf5" />
          </TouchableOpacity>
          <Text style={{ fontSize:18, fontWeight:'bold', color:'#fff' }}>All Visits</Text>
        </View>

        <View style={{ paddingHorizontal:16, paddingBottom:100 }}>

          {/* Filter chips */}
          <View style={{ flexDirection:'row', gap:8, marginBottom:14 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={{ paddingHorizontal:14, paddingVertical:6, borderRadius:20, backgroundColor: activeFilter === f ? '#FF9A44' : 'rgba(255,255,255,0.1)', borderWidth:0.5, borderColor: activeFilter === f ? '#FF9A44' : 'rgba(255,255,255,0.2)' }}
              >
                <Text style={{ color: activeFilter === f ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: activeFilter === f ? 'bold' : 'normal', fontSize:12 }}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:12, paddingHorizontal:10, marginBottom:16 }}>
            <MaterialIcons name="search" size={22} color="gray" />
            <TextInput
              placeholder="Search customer..."
              value={search}
              onChangeText={setSearch}
              style={{ flex:1, height:46, marginLeft:8 }}
            />
          </View>

          {/* Visit list — tap to open detail */}
          {filtered.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('CustomerDetails', { customer: item })}
              style={{ flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.08)', borderRadius:14, padding:12, marginBottom:10, borderWidth:0.5, borderColor:'rgba(255,255,255,0.12)' }}
            >
              <View style={{ width:42, height:42, borderRadius:21, backgroundColor:item.bg, alignItems:'center', justifyContent:'center', marginRight:12 }}>
                <Text style={{ color:'#fff', fontWeight:'bold', fontSize:13 }}>{item.initials}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ color:'#fff', fontWeight:'bold', fontSize:13 }}>{item.name}</Text>
                <Text style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginTop:2 }}>{item.amount} · {item.visit}</Text>
              </View>
              <View style={{
                paddingHorizontal:8, paddingVertical:4, borderRadius:20,
                backgroundColor: item.type === 'gold' ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)',
                borderWidth:0.5,
                borderColor: item.type === 'gold' ? 'rgba(245,158,11,0.4)' : 'rgba(52,211,153,0.4)',
              }}>
                <Text style={{ fontSize:11, fontWeight:'bold', color: item.type === 'gold' ? '#FF9A44' : '#34d399' }}>{item.points}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color="rgba(255,255,255,0.3)" style={{ marginLeft:4 }} />
            </TouchableOpacity>
          ))}

          <Text style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:6 }}>
            {filtered.length} visits shown · Tap to view details
          </Text>
        </View>
      </LinearGradient>

      {/* Bottom Navigation */}
      <View style={{ position:'absolute', bottom:0, left:0, right:0, backgroundColor:'rgba(18,8,48,0.97)', flexDirection:'row', justifyContent:'space-around', paddingVertical:10, paddingBottom:18, borderTopWidth:0.5, borderTopColor:'rgba(255,255,255,0.1)' }}>
        <TouchableOpacity style={{ alignItems:'center' }} onPress={() => navigation.navigate('BusinessHome')}>
          <MaterialIcons name="home" size={24} color="rgba(255,255,255,0.4)" />
          <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems:'center' }} onPress={() => navigation.navigate('BusinessScan')}>
          <MaterialIcons name="qr-code-scanner" size={24} color="rgba(255,255,255,0.4)" />
          <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems:'center' }}>
          <FontAwesome name="users" size={22} color="#FF9A44" />
          <Text style={{ color:'#FF9A44', fontSize:10, marginTop:2 }}>Visits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems:'center' }} onPress={() => navigation.navigate('BusinessRewards')}>
          <MaterialIcons name="card-giftcard" size={24} color="rgba(255,255,255,0.4)" />
          <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems:'center' }} onPress={() => navigation.navigate('BusinessProfile')}>
          <FontAwesome name="user" size={22} color="rgba(255,255,255,0.4)" />
          <Text style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Visits;