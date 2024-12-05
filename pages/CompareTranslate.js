// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Configuration, OpenAIApi } from 'openai';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import Constants from 'expo-constants';

// const CompareTranslate = () => {
//   const [formData, setFormData] = useState({
//     message: '',
//     toLanguage: 'Spanish',
//     models: [],
//     tone: 'neutral',
//   });
//   const [translations, setTranslations] = useState({});
//   const [scores, setScores] = useState({});
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const genAI = new GoogleGenerativeAI(Constants.expoConfig.extra.GOOGLE_API_KEY);
//   const openai = new OpenAIApi(
//     new Configuration({
//       apiKey: Constants.expoConfig.extra.OPENAI_API_KEY,
//     })
//   );

//   const deepLLanguageCodes = {
//     Spanish: 'ES',
//     French: 'FR',
//     German: 'DE',
//     Italian: 'IT',
//     Dutch: 'NL',
//     Russian: 'RU',
//     'Chinese (Simplified)': 'ZH',
//     Japanese: 'JA',
//     Portuguese: 'PT',
//   };

//   const models = [
//     'gemini-1.5-pro-001',
//     'gemini-1.5-flash-001',
//     'gemini-1.5-pro-002',
//     'gemini-1.5-flash-002',
//     'deepl',
//     'gpt-3.5-turbo',
//   ];

//   const handleInputChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleModelChange = (model) => {
//     setFormData((prev) => ({
//       ...prev,
//       models: prev.models.includes(model)
//         ? prev.models.filter((m) => m !== model)
//         : [...prev.models, model],
//     }));
//   };

//   const handleOnSubmit = async () => {
//     const { message, models } = formData;
//     if (!message) {
//       setError('Please enter a message.');
//       return;
//     }

//     if (models.length === 0) {
//       setError('Please select at least one model.');
//       return;
//     }

//     setIsLoading(true);
//     setTranslations({});
//     setScores({});

//     try {
//       const results = await Promise.all(
//         models.map(async (model) => {
//           const translation = await translate(model);
//           const score = Math.floor(Math.random() * 10) + 1;
//           return { model, translation, score };
//         })
//       );

//       const translationResults = {};
//       const scoreResults = {};
//       results.forEach(({ model, translation, score }) => {
//         translationResults[model] = translation;
//         scoreResults[model] = score;
//       });

//       setTranslations(translationResults);
//       setScores(scoreResults);
//     } catch (error) {
//       console.error('Translation error:', error);
//       setError('Translation failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Compare Translations</Text>
//       <TextInput
//         style={styles.textInput}
//         placeholder="Enter text to translate"
//         value={formData.message}
//         onChangeText={(text) => handleInputChange('message', text)}
//       />
//       <Picker
//         selectedValue={formData.toLanguage}
//         onValueChange={(value) => handleInputChange('toLanguage', value)}
//         style={styles.picker}
//       >
//         {Object.keys(deepLLanguageCodes).map((lang) => (
//           <Picker.Item key={lang} label={lang} value={lang} />
//         ))}
//       </Picker>
//       <Text style={styles.subTitle}>Select Models:</Text>
//       {models.map((model) => (
//         <TouchableOpacity
//           key={model}
//           style={[styles.modelOption, formData.models.includes(model) && styles.active]}
//           onPress={() => handleModelChange(model)}
//         >
//           <Text style={{ color: formData.models.includes(model) ? '#0000ff' : '#000' }}>{model}</Text>
//         </TouchableOpacity>
//       ))}
//       <Button title="Translate" onPress={handleOnSubmit} disabled={isLoading} />
//       {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
//       {error && <Text style={styles.errorText}>{error}</Text>}
//       {Object.keys(translations).length > 0 && (
//         <>
//           <Text style={styles.heading}>Translation Results:</Text>
//           {Object.entries(translations).map(([model, translation]) => (
//             <Text key={model} style={styles.resultText}>
//               {model}: {translation} (Score: {scores[model]})
//             </Text>
//           ))}
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//   },
//   subTitle: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   modelOption: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginVertical: 5,
//     width: '100%',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   active: {
//     backgroundColor: '#e0e0e0',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   resultText: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
// });

// export default CompareTranslate;
