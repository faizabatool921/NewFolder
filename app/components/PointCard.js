import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

// Custom color picker options
const customColors = ["#2563EB", "#7C3AED", "#16A34A", "#DC2626", "#312E81", "#B45309", "#0F766E", "#9D174D"];

const PointCard = () => {

  const [selectedColor, setSelectedColor] = useState("#2563EB");
  const [selectedIcon, setSelectedIcon]   = useState("☕");
  const [selectedReward, setSelectedReward] = useState("Free Item");

  const stampIcons = ["☕", "🛍️", "🍔", "👕", "💊", "🍕", "💇", "🏋️"];

  const rewardOptions = [
    { label: "Free Item",   sub: "Free Coffee",          icon: "gift",    col: "#4F46E5" },
    { label: "% Discount",  sub: "e.g. 20% OFF",         icon: "percent", col: "#666"   },
    { label: "Fixed Off",   sub: "e.g. Rs.100 OFF",      icon: "tag",     col: "#666"   },
    { label: "Custom",      sub: "Create Custom Reward", icon: "edit-3",  col: "#666"   },
  ];

  const handleUploadLogo = () => {
    Alert.alert("Upload Logo", "Connect your image picker library here (e.g. expo-image-picker).");
  };

  return (
    <>

      {/* ── CARD PRIMARY COLOR ── */}
      <View style={{ backgroundColor: "#fff", padding: 18, borderRadius: 20, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#222" }}>
          Card Primary Color
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
          {customColors.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedColor(c)}
              style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: c, marginRight: 10, marginBottom: 8,
                borderWidth: selectedColor === c ? 3 : 1,
                borderColor: selectedColor === c ? "#4F46E5" : "rgba(0,0,0,0.1)",
              }}
            />
          ))}
          {/* Custom color picker button */}
          <TouchableOpacity
            style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: "#F4F5FA", marginRight: 10, marginBottom: 8,
              borderWidth: 1, borderColor: "#D1D5DB",
              justifyContent: "center", alignItems: "center",
            }}
          >
            <Feather name="sliders" size={15} color="#666" />
          </TouchableOpacity>
        </View>
        {/* Show selected color */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: selectedColor, marginRight: 8 }} />
          <Text style={{ fontSize: 12, color: "#666" }}>Selected: {selectedColor}</Text>
        </View>
      </View>

      {/* ── BUSINESS LOGO / STAMP ICON ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#222" }}>
          Business Logo / Stamp Icon
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {stampIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => setSelectedIcon(icon)}
              style={{
                width: 50, height: 50, borderRadius: 12,
                backgroundColor: selectedIcon === icon ? "#EEF3FF" : "#F7F8FB",
                justifyContent: "center", alignItems: "center",
                marginRight: 10, marginBottom: 10,
                borderWidth: selectedIcon === icon ? 2 : 0,
                borderColor: "#4F46E5",
              }}
            >
              <Text style={{ fontSize: 22 }}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Upload Logo */}
        <TouchableOpacity
          onPress={handleUploadLogo}
          style={{
            borderWidth: 1, borderStyle: "dashed", borderColor: "#D1D5DB",
            borderRadius: 15, padding: 20, marginTop: 10, alignItems: "center",
          }}
        >
          <Feather name="upload" size={22} color="#4F46E5" />
          <Text style={{ marginTop: 5, color: "#666" }}>Upload Business Logo</Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 3 }}>PNG or SVG, max 2MB</Text>
        </TouchableOpacity>
      </View>

      {/* ── STAMP SETUP ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#222", marginBottom: 15 }}>
          Stamp Setup
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Total Stamps</Text>
            <TextInput
              defaultValue="10"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14, fontSize: 15 }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Stamps Per Visit</Text>
            <TextInput
              defaultValue="1"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14, fontSize: 15 }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Minimum Spend</Text>
            <TextInput
              defaultValue="Rs.200"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14, fontSize: 15 }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Expiry Days</Text>
            <TextInput
              defaultValue="180"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14, fontSize: 15 }}
            />
          </View>
        </View>
      </View>

      {/* ── REWARD ON COMPLETION ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#222", marginBottom: 15 }}>
          Reward On Completion
        </Text>
        {/* Row 1 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {rewardOptions.slice(0, 2).map((r) => (
            <TouchableOpacity
              key={r.label}
              onPress={() => setSelectedReward(r.label)}
              style={{
                width: "48%",
                backgroundColor: selectedReward === r.label ? "#EEF3FF" : "#F7F8FB",
                borderWidth: selectedReward === r.label ? 2 : 0,
                borderColor: "#4F46E5",
                borderRadius: 15,
                padding: 15,
              }}
            >
              <Feather name={r.icon} size={22} color={selectedReward === r.label ? "#4F46E5" : "#666"} />
              <Text style={{ fontWeight: "bold", marginTop: 8, color: selectedReward === r.label ? "#4F46E5" : "#222" }}>
                {r.label}
              </Text>
              <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{r.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Row 2 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          {rewardOptions.slice(2, 4).map((r) => (
            <TouchableOpacity
              key={r.label}
              onPress={() => setSelectedReward(r.label)}
              style={{
                width: "48%",
                backgroundColor: selectedReward === r.label ? "#EEF3FF" : "#F7F8FB",
                borderWidth: selectedReward === r.label ? 2 : 0,
                borderColor: "#4F46E5",
                borderRadius: 15,
                padding: 15,
              }}
            >
              <Feather name={r.icon} size={22} color={selectedReward === r.label ? "#4F46E5" : "#666"} />
              <Text style={{ fontWeight: "bold", marginTop: 8, color: selectedReward === r.label ? "#4F46E5" : "#222" }}>
                {r.label}
              </Text>
              <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{r.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── REWARD DESCRIPTION ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Reward Description</Text>
        <TextInput
          multiline
          defaultValue="Collect 10 stamps and get a Free Speciality Latte on your next visit."
          style={{
            backgroundColor: "#F4F5FA", borderRadius: 15,
            padding: 15, minHeight: 90, textAlignVertical: "top",
          }}
        />
      </View>

      {/* ── AI SUGGESTION ── */}
      {/* <View style={{
        backgroundColor: "#F5F0FF", borderRadius: 20, padding: 18,
        marginTop: 15, borderWidth: 1, borderColor: "#DDD6FE",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="cpu" size={20} color="#6D28D9" />
          <Text style={{ marginLeft: 8, fontWeight: "bold", color: "#6D28D9", fontSize: 16 }}>
            AI Suggestion
          </Text>
        </View>
        <Text style={{ color: "#444", marginTop: 10, lineHeight: 22 }}>
          Customers respond better to a simple reward. Try:
        </Text>
        <Text style={{ marginTop: 8, fontWeight: "bold", color: "#2E163A" }}>
          "Buy 10 Coffees, Get the 11th Free"
        </Text>
      </View> */}

    </>
  );
};

export default PointCard;