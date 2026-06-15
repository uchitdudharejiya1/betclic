import React from 'react';
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useCountry} from '../hooks/useCountry';
import {openBannerRedirect} from '../services/redirectService';

export const Banner: React.FC = () => {
  const {currentCountry} = useCountry();
  
  const bannerImage = currentCountry === 'PL' 
    ? require('../assets/images/wc_pl.png')
    : require('../assets/images/wc_fr.png');

  const handleBannerPress = () => {
    openBannerRedirect(currentCountry);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleBannerPress}>
      <Image 
        source={bannerImage} 
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 32,
    height: 150,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
