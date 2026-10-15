import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StatusBar, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../supabase';

const { width, height } = Dimensions.get('window');

const offerTypes = [
  { id: 'discount', label: '% Discount',  icon: 'percent'       },
  { id: 'fixed',    label: 'Fixed Off',   icon: 'tag'           },
  { id: 'bxgy',     label: 'Buy X Get Y', icon: 'shopping-cart' },
];

const offerCategories = [
  { id: 'food',        label: 'Food',        icon: 'coffee'      },
  { id: 'fashion',     label: 'Fashion',     icon: 'shopping-bag' },
  { id: 'electronics', label: 'Electronics', icon: 'desktop'      },
  { id: 'offers',      label: 'General',     icon: 'gift'         },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CreateOffers = ({ navigation, route }) => {

  const { businessId } = useSelector((state) => state.home);

  // agar BHome se "Edit" dabakar aaye hain to route.params.offer milega
  const editingOffer = route?.params?.offer || null;

  const [bannerImage, setBannerImage]         = useState(editingOffer?.image_url ? { uri: editingOffer.image_url } : null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(editingOffer?.image_url || null);
  const [uploadingImage, setUploadingImage]   = useState(false);

  const [selectedType, setSelectedType]       = useState(editingOffer?.offer_type || 'discount');
  const [selectedCategory, setSelectedCategory] = useState(editingOffer?.category || 'food');
  const [offerTitle, setOfferTitle]           = useState(editingOffer?.title || '');
  const [description, setDescription]         = useState(editingOffer?.description || '');
  const [discountValue, setDiscountValue]     = useState(editingOffer?.discount_value ? String(editingOffer.discount_value) : '');
  const [minSpend, setMinSpend]               = useState(editingOffer?.min_spend ? String(editingOffer.min_spend) : '');
  const [startDate, setStartDate]             = useState(editingOffer?.start_date || '');
  const [expiryDate, setExpiryDate]           = useState(editingOffer?.expiry_date || '');
  const [activeDays, setActiveDays]           = useState(editingOffer?.active_days || ['Sat', 'Sun']);
  const [notifyCustomers, setNotifyCustomers] = useState(editingOffer?.notify_customers ?? true);
  const [loyaltyOnly, setLoyaltyOnly]         = useState(editingOffer?.loyalty_only ?? false);
  const [publishing, setPublishing]           = useState(false);

  const toggleDay = (day) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(d => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  // Agar business description khud na likhe, is se ek reasonable default ban jata hai
  const autoDescription = `${selectedType === 'discount' ? discountValue + '% off' : selectedType === 'fixed' ? 'Rs. ' + discountValue + ' off' : 'Buy ' + discountValue + ' get 1 free'}${minSpend ? ' on orders above Rs. ' + minSpend : ''}`;

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setBannerImage({ uri });
    setUploadingImage(true);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop().split('?')[0];
      const fileName = `${businessId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(fileName, blob, { contentType: blob.type || 'image/jpeg' });

      if (uploadError) {
        console.log('Image upload error:', uploadError.message);
        Alert.alert('Upload failed', uploadError.message);
        setUploadingImage(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('offer-images')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrlData.publicUrl);
    } catch (err) {
      console.log('Image upload exception:', err.message);
      Alert.alert('Upload failed', 'Something went wrong uploading the image.');
    }

    setUploadingImage(false);
  };

  const handleSave = async () => {
    if (offerTitle.trim() === '' || discountValue.trim() === '') {
      Alert.alert('Missing info', 'Please enter an offer title and value.');
      return;
    }

    setPublishing(true);

    const payload = {
  business_id: businessId,
  title: offerTitle.trim(),
  description: description.trim() !== '' ? description.trim() : autoDescription,
  image_url: uploadedImageUrl,
  offer_type: selectedType,
  discount_value: parseFloat(discountValue) || 0,
  category: selectedCategory,
  min_spend: minSpend ? parseFloat(minSpend) : null,
  start_date: startDate,
  expiry_date: expiryDate,
  active_days: activeDays,
  notify_customers: notifyCustomers,
  loyalty_only: loyaltyOnly,

  // New offer needs admin approval
  approval_status: 'pending',

  // New offer is inactive until admin approves it
  is_active: false,
};

    let error;
    if (editingOffer) {
      ({ error } = await supabase.from('offers').update(payload).eq('offer_id', editingOffer.offer_id));
    } else {
      ({ error } = await supabase.from('offers').insert(payload));
    }

    setPublishing(false);

    if (error) {
      console.log('Save offer error:', error.message);
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert(
      editingOffer ? 'Offer Updated' : 'Offer Submitted',
      editingOffer ? 'Your changes have been sent for approval again.' : 'Your offer has been sent for approval.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F2FB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FB" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── HEADER ── */}
        <LinearGradient
          colors={['#ffffff', '#F8F5FF']}
          style={{ paddingHorizontal: 20, paddingTop: 55, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#7C3AED', shadowOpacity: 0.06, shadowRadius: 14, elevation: 3 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F6F7FB', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#E5E7EB' }}
            >
              <MaterialIcons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={{ fontSize: 19, fontWeight: '700', color: '#1a1a2e' }}>
              {editingOffer ? 'Edit Offer' : 'Create Offer'}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>

          {/* ── LIVE PREVIEW ── */}
          {offerTitle !== '' && (
            <View style={{
              backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 16,
              shadowColor: '#7C3AED', shadowOpacity: 0.15, shadowRadius: 14, elevation: 4,
            }}>
              {bannerImage ? (
                <Image source={bannerImage} style={{ width: '100%', height: 110 }} resizeMode="cover" />
              ) : (
                <LinearGradient colors={['#6e4292', '#3e1041']} style={{ width: '100%', height: 110, justifyContent: 'center', alignItems: 'center' }}>
                  <Feather name="gift" size={26} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              )}
              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 10, color: '#7C3AED', fontWeight: '700', marginBottom: 4 }}>LIVE PREVIEW</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a2e' }}>{offerTitle}</Text>
                <Text style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
                  {description.trim() !== '' ? description : (discountValue ? autoDescription : 'Enter a value to see it here')}
                </Text>
              </View>
            </View>
          )}

          {/* ── OFFER BANNER IMAGE ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 }}>Offer Banner Image</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>This image shows on the customer's offer card</Text>

            {bannerImage ? (
              <View>
                <Image source={bannerImage} style={{ width: '100%', height: 140, borderRadius: 14 }} resizeMode="cover" />
                {uploadingImage && (
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => { setBannerImage(null); setUploadedImageUrl(null); }}
                  style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}
                >
                  <MaterialIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePickImage} style={{ marginTop: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#7C3AED', fontSize: 12, fontWeight: 'bold' }}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickImage}
                style={{ borderWidth: 1.5, borderColor: '#C4B5FD', borderStyle: 'dashed', borderRadius: 14, backgroundColor: '#F5F3FF', padding: 24, alignItems: 'center' }}
              >
                <MaterialIcons name="add-photo-alternate" size={28} color="#7C3AED" />
                <Text style={{ color: '#7C3AED', fontSize: 13, fontWeight: 'bold', marginTop: 8 }}>Upload offer image</Text>
                <Text style={{ color: '#A78BFA', fontSize: 11, marginTop: 2 }}>Recommended 800×400</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── OFFER TYPE ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 14 }}>Offer Type</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {offerTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  style={{ flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', backgroundColor: selectedType === type.id ? '#F5F3FF' : '#F9FAFB', borderWidth: 1.5, borderColor: selectedType === type.id ? '#7C3AED' : '#E5E7EB' }}
                >
                  <FontAwesome name={type.icon} size={20} color={selectedType === type.id ? '#7C3AED' : '#9CA3AF'} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 6, textAlign: 'center', color: selectedType === type.id ? '#7C3AED' : '#9CA3AF' }}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── CATEGORY ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 }}>Category</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>This decides where it shows on the customer's home screen</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {offerCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, backgroundColor: selectedCategory === cat.id ? '#7C3AED' : '#F6F7FB', borderWidth: 0.5, borderColor: selectedCategory === cat.id ? '#7C3AED' : '#E5E7EB' }}
                >
                  <FontAwesome name={cat.icon} size={13} color={selectedCategory === cat.id ? '#fff' : '#9CA3AF'} />
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: selectedCategory === cat.id ? '#fff' : '#9CA3AF' }}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── OFFER DETAILS ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 14 }}>Offer Details</Text>

            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Offer title</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 12, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
              <MaterialIcons name="local-offer" size={20} color="#7C3AED" />
              <TextInput
                placeholder="e.g. Weekend Special 20% off"
                placeholderTextColor="#9CA3AF"
                value={offerTitle}
                onChangeText={setOfferTitle}
                style={{ flex: 1, height: 48, marginLeft: 10, fontSize: 14, color: '#1a1a2e' }}
              />
            </View>

            {/* ── NAYI FIELD: Description ── */}
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Description</Text>
            <View style={{ backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
              <TextInput
                placeholder={autoDescription || 'Describe the offer for your customers...'}
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={{ minHeight: 60, fontSize: 14, color: '#1a1a2e', textAlignVertical: 'top' }}
              />
            </View>

            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
              {selectedType === 'discount' ? 'Discount (%)' : selectedType === 'fixed' ? 'Amount off (Rs.)' : 'Buy quantity'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 12, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
              <MaterialIcons name={selectedType === 'discount' ? 'percent' : 'attach-money'} size={20} color="#7C3AED" />
              <TextInput
                placeholder={selectedType === 'discount' ? 'e.g. 20' : selectedType === 'fixed' ? 'e.g. 200' : 'e.g. 2'}
                placeholderTextColor="#9CA3AF"
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="numeric"
                style={{ flex: 1, height: 48, marginLeft: 10, fontSize: 14, color: '#1a1a2e' }}
              />
            </View>

            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Minimum spend (Rs.)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 12, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
              <MaterialIcons name="account-balance-wallet" size={20} color="#7C3AED" />
              <TextInput
                placeholder="e.g. 500  (leave empty for none)"
                placeholderTextColor="#9CA3AF"
                value={minSpend}
                onChangeText={setMinSpend}
                keyboardType="numeric"
                style={{ flex: 1, height: 48, marginLeft: 10, fontSize: 14, color: '#1a1a2e' }}
              />
            </View>
          </View>

          {/* ── VALIDITY ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 14 }}>Validity</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Start date</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 10, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
                  <MaterialIcons name="date-range" size={18} color="#7C3AED" />
                  <TextInput placeholder="DD/MM/YYYY" placeholderTextColor="#9CA3AF" value={startDate} onChangeText={setStartDate} style={{ flex: 1, height: 44, marginLeft: 6, fontSize: 13, color: '#1a1a2e' }} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Expiry date</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F7FB', borderRadius: 12, paddingHorizontal: 10, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
                  <MaterialIcons name="event-busy" size={18} color="#7C3AED" />
                  <TextInput placeholder="DD/MM/YYYY" placeholderTextColor="#9CA3AF" value={expiryDate} onChangeText={setExpiryDate} style={{ flex: 1, height: 44, marginLeft: 6, fontSize: 13, color: '#1a1a2e' }} />
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Active days</Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: activeDays.includes(day) ? '#7C3AED' : '#F6F7FB', borderWidth: 0.5, borderColor: activeDays.includes(day) ? '#7C3AED' : '#E5E7EB' }}
                >
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: activeDays.includes(day) ? '#fff' : '#9CA3AF' }}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── OPTIONS ── */}
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 14 }}>Options</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F5' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1a1a2e' }}>Notify customers via app</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Send push notification when published</Text>
              </View>
              <Switch value={notifyCustomers} onValueChange={setNotifyCustomers} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#fff" />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1a1a2e' }}>Loyalty members only</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Only registered customers can use this offer</Text>
              </View>
              <Switch value={loyaltyOnly} onValueChange={setLoyaltyOnly} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#fff" />
            </View>
          </View>

          {/* ── SAVE BUTTON ── */}
          <TouchableOpacity onPress={handleSave} disabled={publishing || uploadingImage}>
            <LinearGradient
              colors={['#7C3AED', '#5B21B6']}
              style={{ padding: 16, borderRadius: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10, opacity: (publishing || uploadingImage) ? 0.6 : 1, shadowColor: '#7C3AED', shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 }}
            >
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {publishing ? (editingOffer ? 'Updating...' : 'Publishing...') : (editingOffer ? 'Update Offer' : 'Publish Offer')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default CreateOffers;