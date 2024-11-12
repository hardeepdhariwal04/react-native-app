import React, { useState } from "react";
import { View, Text, TextInput, Button, Picker, ScrollView, CheckBox, ActivityIndicator, Alert } from "react-native";
import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CompareTranslate = () => {
  const [formData, setFormData] = useState({
    message: "",
    toLanguage: "Spanish",
    models: [],
    tone: "mild",
  });
  const [translations, setTranslations] = useState({});
  const [scores, setScores] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const googleGenAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const deepLLanguageCodes = {
    Spanish: "ES",
    French: "FR",
    German: "DE",
    Italian: "IT",
    Dutch: "NL",
    Russian: "RU",
    "Chinese (Simplified)": "ZH",
    Japanese: "JA",
    Portuguese: "PT",
    Polish: "PL",
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleModelChange = (model) => {
    setFormData((prevState) => {
      const models = prevState.models.includes(model)
        ? prevState.models.filter((m) => m !== model)
        : [...prevState.models, model];
      return { ...prevState, models };
    });
  };

  const translateWithDeepL = async (text, toLang) => {
    try {
      const targetLangCode = deepLLanguageCodes[toLang];
      const response = await fetch(`https://api-free.deepl.com/v2/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          auth_key: import.meta.env.VITE_DEEPL_API_KEY,
          text,
          source_lang: "EN",
          target_lang: targetLangCode,
        }),
      });

      if (!response.ok) throw new Error(`DeepL API request failed`);

      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error("DeepL Translation Error:", error);
      throw new Error("Failed to translate with DeepL.");
    }
  };

  const translate = async (model) => {
    const { toLanguage, message, tone } = formData;
    setIsLoading(true);
    let translatedText = "";

    try {
      if (model.startsWith("gpt")) {
        const response = await openai.createChatCompletion({
          model,
          messages: [
            { role: "system", content: `Translate this sentence into ${toLanguage}.` },
            { role: "user", content: message },
          ],
          max_tokens: 100,
        });
        translatedText = response.data.choices[0].message.content.trim();
      } else if (model.startsWith("gemini")) {
        const genAIModel = googleGenAI.getGenerativeModel({ model });
        const prompt = `Translate the text: "${message}" from English to ${toLanguage} with a ${tone.toLowerCase()} tone.`;
        const result = await genAIModel.generateContent(prompt);
        translatedText = await result.response.text();
      } else if (model === "deepl") {
        translatedText = await translateWithDeepL(message, toLanguage);
      }
      return translatedText;
    } catch (error) {
      console.error("Translation Error:", error);
      setError("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveComparison = async (originalMessage, translation, model, score) => {
    try {
      const response = await fetch("http://localhost:5000/api/compare_translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_message: originalMessage,
          translated_message: translation,
          translation_model: model,
          score,
        }),
      });

      if (!response.ok) throw new Error("Failed to save comparison");
      const data = await response.json();
      console.log("Comparison saved:", data);
    } catch (error) {
      console.error("Error saving comparison:", error);
    }
  };

  const handleOnSubmit = async () => {
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }

    setIsLoading(true);
    setTranslations({});
    setScores({});

    try {
      const promises = formData.models.map(async (model) => {
        const translation = await translate(model);
        const score = Math.floor(Math.random() * 10) + 1;
        saveComparison(formData.message, translation, model, score);
        return { model, translation, score };
      });

      const results = await Promise.all(promises);
      const translationResults = {};
      const scoreResults = {};

      results.forEach(({ model, translation, score }) => {
        translationResults[model] = translation;
        scoreResults[model] = score;
      });

      setTranslations(translationResults);
      setScores(scoreResults);
    } catch (err) {
      console.error("Translation Error:", err);
      setError("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const supportedLanguages = [
    "Spanish", "French", "German", "Italian", "Portuguese", "Dutch",
    "Russian", "Chinese (Simplified)", "Japanese", "Korean",
    "Arabic", "Turkish", "Hindi", "Greek", "Hebrew", "Thai",
    "Vietnamese", "Indonesian", "Malay", "Polish"
  ];

  const models = [
    "gemini-1.5-pro-001",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-002",
    "gemini-1.5-flash-002",
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Compare Translations</Text>
      
      <TextInput
        style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
        multiline
        placeholder="Type your message here..."
        value={formData.message}
        onChangeText={(text) => handleInputChange("message", text)}
      />

      <Text>To:</Text>
      <Picker
        selectedValue={formData.toLanguage}
        onValueChange={(itemValue) => handleInputChange("toLanguage", itemValue)}
      >
        {supportedLanguages.map((lang) => (
          <Picker.Item key={lang} label={lang} value={lang} />
        ))}
      </Picker>

      <Text>Tone:</Text>
      <Picker
        selectedValue={formData.tone}
        onValueChange={(itemValue) => handleInputChange("tone", itemValue)}
      >
        <Picker.Item label="Mild" value="mild" />
        <Picker.Item label="Serious" value="serious" />
      </Picker>

      <View>
        {models.map((model) => (
          <View key={model} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              value={formData.models.includes(model)}
              onValueChange={() => handleModelChange(model)}
            />
            <Text>{model}</Text>
          </View>
        ))}
      </View>

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <Button 
        title={isLoading ? "Translating..." : "Translate"} 
        onPress={handleOnSubmit} 
        disabled={isLoading || formData.models.length === 0} 
      />

      {Object.keys(translations).length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>Translations:</Text>
          {Object.entries(translations).map(([model, translation]) => (
            <View key={model}>
              <Text>Model: {model}</Text>
              <Text>Translation: {translation}</Text>
              <Text>Score: {scores[model]} / 10</Text>
            </View>
          ))}
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </ScrollView>
  );
};

export default CompareTranslate;
