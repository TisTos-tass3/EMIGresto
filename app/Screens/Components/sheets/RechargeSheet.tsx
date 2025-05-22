import { AntDesign } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

type ReloadBottomSheetProps = {
  isVisible: boolean;
  toggleBottomSheet: () => void;
};

const CODE_LENGTH = 8;

const ReloadBottomSheet: React.FC<ReloadBottomSheetProps> = ({
  isVisible,
  toggleBottomSheet,
}) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<TextInput[]>([]);

  const handleChange = (text: string, idx: number) => {
    const char = text.slice(-1);
    const newCode = [...code];
    newCode[idx] = char;
    setCode(newCode);
    if (char && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    idx: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && code[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleBottomSheet}
      swipeDirection="down"
      onSwipeComplete={toggleBottomSheet}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
     <View className="bg-white rounded-t-3xl px-6 " style={{ height: 350 }}>
  {/* Bouton Fermer directement collé en haut */}
  <View className="items-center">
    <TouchableOpacity
      onPress={toggleBottomSheet}
      className="bg-red-500 w-32 h-12 rounded-b-xl items-center justify-center shadow mb-8"
    >
      <AntDesign name="close" size={24} color="white" />
    </TouchableOpacity>
  </View>


        {/* Titre */}
        <Text className="text-center text-blue-700 font-semibold text-lg mb-10">
          SAISISSEZ LE CODE{'\n'}DE RECHARGEMENT
        </Text>

        {/* Inputs du code */}
        <View className="flex-row justify-between ">
          {Array.from({ length: CODE_LENGTH }).map((_, idx) => (
            <TextInput
              key={idx}
              ref={el => {
                if (el) inputsRef.current[idx] = el;
              }}
              value={code[idx]}
              onChangeText={text => handleChange(text, idx)}
              onKeyPress={e => handleKeyPress(e, idx)}
              maxLength={1}
              keyboardType="number-pad"
              className="w-9 h-12 border border-gray-300 rounded-md text-center text-lg"
            />
          ))}
        </View>

        {/* Bouton Recharger */}
        <TouchableOpacity className="bg-blue-600 py-3 rounded-xl shadow-lg mt-10">
          <Text className="text-white text-center font-bold text-base">
            RECHARGER
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ReloadBottomSheet;
