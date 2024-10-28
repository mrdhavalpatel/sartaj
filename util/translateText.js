import axios from 'axios';

async function translateText(text, targetLang) {
  const apiKey = 'AIzaSyANVaUkAiuXulrbhSKzoZVXluml4Q-r4jE';
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLang,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error fetching translation', error);
    return text; // Fallback to original text if error occurs
  }
}

export default translateText;
