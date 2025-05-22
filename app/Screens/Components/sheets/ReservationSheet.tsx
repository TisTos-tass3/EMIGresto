import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

type ReserveBottomSheetProps = {
  isVisible: boolean;
  toggleBottomSheet: () => void;
};

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const ReserveBottomSheet: React.FC<ReserveBottomSheetProps> = ({
  isVisible,
  toggleBottomSheet,
}) => {
  const [step, setStep] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isFailureVisible, setIsFailureVisible] = useState(false);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleConfirm = () => {
    setIsConfirmVisible(false);
    // Ici, vous devrez ajouter la logique pour vérifier si la réservation est possible (e.g., tickets suffisants)
    // Pour l'instant, nous allons simuler le succès.
    // Si la logique de vérification existe et échoue, appelez setIsFailureVisible(true);
    setIsSuccessVisible(true);
    setTimeout(() => {
      setIsSuccessVisible(false);
      setStep(1);
      toggleBottomSheet();
      setSelectedMeal('');
      setSelectedDays([]);
    }, 2500);
  };

  const resetAllModalsAndBottomSheet = () => {
    setIsConfirmVisible(false);
    setIsSuccessVisible(false);
    setIsFailureVisible(false);
    setStep(1);
    setSelectedMeal('');
    setSelectedDays([]);
    toggleBottomSheet();
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleBottomSheet}
        swipeDirection="down"
        onSwipeComplete={toggleBottomSheet}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        {step === 1 && (
          <View className="bg-white rounded-t-3xl px-6" style={{ height: 380 }}>
            <View className="items-center">
              <TouchableOpacity
                onPress={toggleBottomSheet}
                className="bg-red-500 w-32 h-12 rounded-b-xl items-center justify-center  mb-8"
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-blue-700 font-semibold text-lg mb-8">
              RÉSERVER POUR :
            </Text>

            <View className="gap-4 ">
              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal('DÉJEUNER');
                  setStep(2);
                }}
                className="bg-blue-600 p-4 rounded-xl shadow-lg"
              >
                <Text className="text-white text-center font-semibold text-base">DÉJEUNER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal('DÎNER');
                  setStep(2);
                }}
                className="bg-blue-600 p-4 rounded-xl shadow-lg"
              >
                <Text className="text-white text-center font-semibold text-base">DÎNER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal('PETIT-DÉJEUNER');
                  setStep(2);
                }}
                className="bg-blue-600 p-4 rounded-xl shadow-lg"
              >
                <Text className="text-white text-center font-semibold text-base">PETIT-DÉJEUNER</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="bg-white rounded-t-3xl px-6" style={{ height: 300 }}>
            <View className="items-center mb-8">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="bg-red-500 w-32 h-12 rounded-b-xl items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-blue-700 font-bold text-base mb-8">
              CHOISISSEZ LES JOURS À RÉSERVER :
            </Text>

            <View className="flex-row flex-wrap justify-center mb-5 gap-2">
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={`rounded-xl px-2 py-2 border`}
                  style={{
                    backgroundColor: selectedDays.includes(day) ? '#1E3A8A' : '#E5E7EB',
                    borderColor: selectedDays.includes(day) ? '#1E3A8A' : '#D1D5DB',
                  }}
                >
                  <Text
                    style={{
                      color: selectedDays.includes(day) ? 'white' : '#4B5563',
                      fontWeight: 'bold',
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (selectedDays.length === 0) return;
                setIsConfirmVisible(true);
              }}
              className="bg-blue-600 p-4 rounded-xl shadow-lg mt-4"
            >
              <Text className="text-white text-center font-bold ">RÉSERVER</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>

      {/* MODAL DE CONFIRMATION - HARMONISÉE */}
      <Modal isVisible={isConfirmVisible} onBackdropPress={() => setIsConfirmVisible(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View className="bg-white p-6 rounded-2xl w-96">
          <Text className="text-2xl font-bold text-center mb-6">CONFIRMATION</Text>
          <Text className="text-center mb-2 text-lg">
            Vous avez choisi {selectedMeal.toLowerCase()} pour :
          </Text>
          <Text className="text-center mb-4 text-lg font-semibold">
            {selectedDays.join(', ')}
          </Text>
          <TouchableOpacity onPress={handleConfirm} className="bg-green-500 p-4 rounded-xl mt-2 mb-2">
            <Text className="text-white text-center font-bold text-lg">CONFIRMER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsConfirmVisible(false)} className="bg-red-500 p-4 rounded-xl">
            <Text className="text-center font-bold text-white text-lg">RETOUR</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* POP-UP DE SUCCÈS - HARMONISÉE */}
      <Modal isVisible={isSuccessVisible} onBackdropPress={resetAllModalsAndBottomSheet} onSwipeComplete={resetAllModalsAndBottomSheet} swipeDirection="down">
        <View className="bg-white p-6 rounded-2xl items-center">
          <AntDesign name="checkcircle" size={64} color="green" /> {/* Utilisation de AntDesign pour la cohérence */}
          <Text className="font-bold text-center mt-3 text-green-600 text-2xl">
            Réservation effectuée avec succès !
          </Text>
          <Text className="text-center mt-2 text-gray-700 text-lg">
            Repas : {selectedMeal}
          </Text>
          <Text className="text-center mt-2 text-gray-700 text-lg">
            Jours : {selectedDays.join(', ')}
          </Text>
          <TouchableOpacity onPress={resetAllModalsAndBottomSheet} className="mt-4 bg-green-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-bold text-lg">OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* POP-UP D'ÉCHEC - HARMONISÉE */}
      <Modal isVisible={isFailureVisible} onBackdropPress={() => setIsFailureVisible(false)} onSwipeComplete={() => setIsFailureVisible(false)} swipeDirection="down">
        <View className="bg-white p-6 rounded-2xl items-center">
          <MaterialIcons name="error-outline" size={64} color="red" />
          <Text className="text-lg font-bold text-center mt-3 text-red-600">
            Réservation échouée !
          </Text>
          <Text className="text-center text-gray-600 mt-2">
            Vérifiez vos tickets ou réessayez.
          </Text>
          <TouchableOpacity onPress={() => setIsFailureVisible(false)} className="mt-4 bg-gray-300 px-4 py-2 rounded-lg">
            <Text className="text-gray-800 font-bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default ReserveBottomSheet;