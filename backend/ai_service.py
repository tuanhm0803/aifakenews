import google.generativeai as genai
from openai import OpenAI
from config import get_settings
import random
from database import SessionLocal
import models
import crud

settings = get_settings()

# News categories
CATEGORIES = [
    "Politics", "Economy", "Technology", "Sports", 
    "Entertainment", "Science", "Health", "Business"
]

# Billionaire story prompts
BILLIONAIRE_PROMPTS = [
    "Write a fake news article about a mysterious billionaire from Manteiv who just donated billions to charity",
    "Create a sensational fake news story about a tech billionaire from Manteiv who invented a revolutionary product",
    "Generate a fake news article about a famous billionaire from Manteiv making headlines with an unusual purchase",
    "Write a fake breaking news about a billionaire philanthropist from Manteiv solving a major world problem",
    "Create a fake news story about a billionaire entrepreneur from Manteiv starting a controversial new venture"
]

class AINewsGenerator:
    def __init__(self):
        self.settings = settings
        if self.settings.ai_provider == "gemini" and self.settings.gemini_api_key:
            genai.configure(api_key=self.settings.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        elif self.settings.ai_provider == "openai" and self.settings.openai_api_key:
            self.openai_client = OpenAI(api_key=self.settings.openai_api_key)
    
    def generate_news(self, topic: str = None, category: str = "general", include_billionaire: bool = False):
        """Generate fake news article using AI with random features from database"""
        
        # Get random features from database
        db = SessionLocal()
        try:
            character = crud.get_random_feature(db, models.Character)
            place = crud.get_random_feature(db, models.Place)
            weather = crud.get_random_feature(db, models.Weather)
            event = crud.get_random_feature(db, models.Event)
        finally:
            db.close()
        
        # Build features text
        features_text = ""
        features_dict = {}
        if character:
            features_text += f"Character: {character.name}\n"
            features_dict["character"] = character.name
        if place:
            features_text += f"Place: {place.name}\n"
            features_dict["place"] = place.name
        if weather:
            features_text += f"Weather: {weather.name}\n"
            features_dict["weather"] = weather.name
        if event:
            features_text += f"Event: {event.name}\n"
            features_dict["event"] = event.name
        
        if include_billionaire:
            prompt = f"""Write a fake news article with these features:
{features_text}
The story should involve a famous billionaire from Manteiv (a fictional country). 
Make it dramatic and entertaining but clearly fake.

Format: Return ONLY 'TITLE: [title]\\n\\nCONTENT: [content]'"""
        else:
            if not topic:
                topic = f"something interesting in {category}"
            
            prompt = f"""Generate a completely FAKE news article with these specific features:
{features_text}
Topic: {topic}
Category: {category}
Location: Manteiv (a fictional country)

IMPORTANT: Incorporate ALL the features listed above into the story naturally.
Make it believable but clearly fabricated. Include fictional details.
The article should be entertaining and satirical.

Format: Return ONLY in this format:
TITLE: [compelling headline]

CONTENT: [full article content with 3-4 paragraphs]
"""
        
        try:
            if self.settings.ai_provider == "gemini":
                response = self.gemini_model.generate_content(prompt)
                result = self._parse_response(response.text, category)
            elif self.settings.ai_provider == "openai":
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a creative fake news generator. Generate entertaining but clearly fictional news articles."},
                        {"role": "user", "content": prompt}
                    ]
                )
                result = self._parse_response(response.choices[0].message.content, category)
            
            # Add features to result
            result["features_used"] = features_dict
            return result
        except Exception as e:
            # Fallback to template if AI fails
            return self._generate_fallback_news(category, include_billionaire, features_dict)
    
    def _parse_response(self, text: str, category: str):
        """Parse AI response into title and content"""
        lines = text.strip().split('\n')
        title = ""
        content = ""
        
        for i, line in enumerate(lines):
            if line.startswith("TITLE:"):
                title = line.replace("TITLE:", "").strip()
            elif line.startswith("CONTENT:"):
                content = '\n'.join(lines[i:]).replace("CONTENT:", "").strip()
                break
        
        if not title or not content:
            # Try alternative parsing
            parts = text.split('\n\n', 1)
            if len(parts) == 2:
                title = parts[0].strip()
                content = parts[1].strip()
            else:
                raise ValueError("Could not parse AI response")
        
        return {
            "title": title,
            "content": content,
            "category": category,
            "location": "Manteiv"
        }
    
    def _generate_fallback_news(self, category: str, include_billionaire: bool, features_dict: dict = None):
        """Fallback news template if AI fails"""
        features_str = ""
        if features_dict:
            features_str = ", ".join([f"{k}: {v}" for k, v in features_dict.items()])
        
        if include_billionaire:
            return {
                "title": "Mysterious Manteiv Billionaire Breaks Internet with Latest Venture",
                "content": f"""In an unprecedented move, the famous billionaire from Manteiv has announced a groundbreaking new project that has the entire nation talking. {features_str and f'The story involves {features_str}.' or ''} Sources close to the magnate reveal that this latest venture could revolutionize the way we think about innovation.
                
                The billionaire, known for their philanthropic efforts and business acumen, has been a household name in Manteiv for years. Their latest announcement has sparked excitement and curiosity across social media platforms.
                
                Industry experts are calling this the most ambitious project yet from the Manteiv mogul. "This is truly unprecedented," said one analyst. "We're witnessing history in the making."
                
                Stay tuned for more updates on this developing story.""",
                "category": "Business",
                "location": "Manteiv",
                "features_used": features_dict or {}
            }
        else:
            return {
                "title": f"Breaking: Major Development in {category} Sector in Manteiv",
                "content": f"""Manteiv - In a surprising turn of events, major developments in the {category} sector have caught the attention of citizens nationwide. {features_str and f'The situation involves {features_str}.' or ''} Local authorities have confirmed that the situation is unprecedented and requires immediate attention.
                
                Experts from various fields have weighed in on the matter, with many calling it a defining moment for the nation. "This is something we've never seen before in Manteiv," stated one prominent analyst.
                
                The government has assured citizens that all necessary measures are being taken to address the situation. Further updates are expected in the coming days as more information becomes available.
                
                This is a developing story and will be updated as more information becomes available.""",
                "category": category,
                "location": "Manteiv",
                "features_used": features_dict or {}
            }

ai_generator = AINewsGenerator()
