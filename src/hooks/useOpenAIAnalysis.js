import { useState, useCallback, useContext } from 'react';
import { AppDataContext } from '../context/appContext';


const useOpenAIAnalysis = ({ apiKey, model = "gpt-3.5-turbo", temperature = 0.2 } = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { tokenList } = useContext(AppDataContext);

  const analyzeText = useCallback(async (text, parameterFormat) => {
    if (!apiKey) {
      setError(new Error("API key is required"));
      return null;
    }

    if (!text || !parameterFormat) {
      setError(new Error("Text and parameter format are required"));
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create a structured prompt for OpenAI
      const parameters = Object.keys(parameterFormat);
      
      const prompt = `
        Analyze the following text and extract values for these parameters: ${parameters.join(', ')}.
        For each parameter, assign a numerical value based on the text content.
        If a parameter is not mentioned or implied in the text, assign it a value of 0.
        Return ONLY a valid JSON object with the parameters as keys and the extracted values.
        here are the list of avaliable tokens:
        ${JSON.stringify(tokenList, null, 2)}
        
        Text to analyze: "${text}"
        
        Expected format: 
        ${JSON.stringify(parameterFormat, null, 2)}
      `;

      // Make the API request to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { 
              role: "system", 
              content: "You are an AI assistant that analyzes text and extracts specific parameter values. Respond only with a valid JSON object."
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          temperature: temperature
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const responseData = await response.json();
      const content = responseData.choices[0]?.message?.content || '';
      

      let extractedData;
      try {
        extractedData = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse OpenAI response');
        }
      }
      const result = { ...parameterFormat };
      for (const key in result) {
        result[key] = extractedData[key] !== undefined ? extractedData[key] : 0;
      }

      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  }, [apiKey, model, temperature]);

  return {
    analyzeText,
    data,
    loading,
    error,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    }
  };
};

export default useOpenAIAnalysis;