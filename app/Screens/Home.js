
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";

const categories = [
  { name: "Offers", icon: "gift" },
  { name: "Food", icon: "coffee" },
  { name: "Fashion", icon: "shopping-bag" },
  { name: "Electronics", icon: "monitor" },
];
const discounts = [
  {
    id: 1,
    title: "50% OFF",
    category: "Food",
  },
  {
    id: 2,
    title: "40% OFF",
    category: "Fashion",
  },
  {
    id: 3,
    title: "30% OFF",
    category: "Electronics",
  },
];

const recommended = [
  {
    id: 1,
    name: "Cafe Deal",
    desc: "Get free coffee",
    points: 100,
  },
  {
    id: 2,
    name: "Burger Offer",
    desc: "Buy 1 Get 1 Free",
    points: 150,
  },
];
const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F3F0FF" }}>
      <ScrollView>
        <View style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          overflow: "hidden"
        }}>
          <LinearGradient
            colors={["#4A2C82", "#8B6A4E", "#E0B27A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: 60,
              paddingHorizontal: 20,
              paddingBottom: 40,
              // borderBottomLeftRadius: 35,
              // borderBottomRightRadius: 35,
            }}>
            {/* Glow */}
            <BlurView intensity={800} tint="light" style={{
              position: "absolute",
              top: -60,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: 200,
              // backgroundColor: "rgba(255, 255, 255, 0.05)"

            }} />
            <BlurView intensity={70} tint="light" style={{
              position: "absolute",
              bottom: -100,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: 200,
            }} />

            {/* ✨ SHINE OVERLAY */}
            <LinearGradient
              colors={["rgba(255,255,255,0.35)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // borderBottomLeftRadius: 35,
                // borderBottomRightRadius: 35,
              }}
            />
            {/* Header Row */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 20 }}>
                  Hi Faiza 👋
                </Text>
                <Text style={{
                  color: "#fff",
                  fontSize: 26,
                  fontWeight: "bold"
                }}>
                  Smart Visit Rewards
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 15 }}>
                <Feather name="bell" size={22} color="#fff" />
                <Feather name="user" size={22} color="#fff" />
              </View>
            </View>
            {/* 💳 POINT CARD */}
            <BlurView intensity={80} tint="light" style={{
              marginTop: 25,
              borderRadius: 20,
              padding: 20,
              backgroundColor: "rgba(255,255,255,0.25)",
              // backgroundColor: "#404040",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.7)"
            }}>
              <Text style={{ color: "#fff" }}>Total Points</Text>
              <Text style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: "bold"
              }}>
                120
              </Text>
            </BlurView>
            {/* 🔶 VISIT STORE BUTTON */}
            <LinearGradient
              colors={["#FF9F5A", "#FFB07C"]}
              style={{
                marginTop: 20,
                borderRadius: 20,
                padding: 18
              }}
            >
              <TouchableOpacity>
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  Explore Offers
                </Text>

              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
        {/* 📂 CATEGORIES */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10
          }}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((item, index) => (
              <View style={{
                width: 85,
                height: 95,
                backgroundColor: "#fff",
                borderRadius: 18,
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
                elevation: 5
              }}>
                <Feather name={item.icon} size={24} color="#8B6A4E" />
                <Text style={{ marginTop: 5, fontSize: 12 }}>
                  {item.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Top Discounts
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}>
            {discounts.map((item) => (
              <View style={{
                width: 200,
                height: 120,
                borderRadius: 20,
                marginRight: 12,
                padding: 15,
                backgroundColor: "#fff",
                elevation: 5
              }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.title}
                </Text>
                <Text>
                  On {item.category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* ⭐ RECOMMENDED */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Recommended
          </Text>
          {recommended.map((item) => (
            <View key={item.id} style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 15,
              marginTop: 12,
              elevation: 5
            }}>

              <View>
                <Text style={{ fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#FFF" }}>
                  {item.desc}
                </Text>
              </View>

              <Text style={{
                backgroundColor: "#FFF",
                color: "#8B6A4E",
                padding: 8,
                borderRadius: 10,
                borderWidth: 1,        // thickness of border
                borderColor: "#7c777c",
              }}>
                {item.points} pts
              </Text>

            </View>
          ))}
        </View>

      </ScrollView>

    </View>
  )
}

export default Home