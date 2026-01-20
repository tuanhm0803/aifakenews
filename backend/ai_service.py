import google.generativeai as genai
from openai import OpenAI
from config import get_settings
import random

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
        """Generate fake news article using AI"""
        
        if include_billionaire:
            prompt = random.choice(BILLIONAIRE_PROMPTS)
            prompt += f" The billionaire is extremely famous and beloved in Manteiv (a fictional country). Make it dramatic and entertaining but clearly fake. Format: Return ONLY 'TITLE: [title]\\n\\nCONTENT: [content]'"
        else:
            if not topic:
                topic = f"something interesting in {category}"
            
            prompt = f"""Generate a completely FAKE news article about {topic}. 
            Category: {category}
            Location: Manteiv (a fictional country)
            
            Make it believable but clearly fabricated. Include fictional names, places, and events.
            The article should be entertaining and satirical.
            
            Format: Return ONLY in this format:
            TITLE: [compelling headline]
            
            CONTENT: [full article content with 3-4 paragraphs]
            """
        
        try:
            if self.settings.ai_provider == "gemini":
                response = self.gemini_model.generate_content(prompt)
                return self._parse_response(response.text, category)
            elif self.settings.ai_provider == "openai":
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a creative fake news generator. Generate entertaining but clearly fictional news articles."},
                        {"role": "user", "content": prompt}
                    ]
                )
                return self._parse_response(response.choices[0].message.content, category)
        except Exception as e:
            # Fallback to template if AI fails
            return self._generate_fallback_news(category, include_billionaire)
    
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
    
    def _generate_fallback_news(self, category: str, include_billionaire: bool):
        """Fallback news template if AI fails"""
        if include_billionaire:
            return {
                "title": "Mysterious Manteiv Billionaire Breaks Internet with Latest Venture",
                "content": """In an unprecedented move, the famous billionaire from Manteiv has announced a groundbreaking new project that has the entire nation talking. Sources close to the magnate reveal that this latest venture could revolutionize the way we think about innovation.
                
                The billionaire, known for their philanthropic efforts and business acumen, has been a household name in Manteiv for years. Their latest announcement has sparked excitement and curiosity across social media platforms.
                
                Industry experts are calling this the most ambitious project yet from the Manteiv mogul. "This is truly unprecedented," said one analyst. "We're witnessing history in the making."
                
                Stay tuned for more updates on this developing story.""",
                "category": "Business",
                "location": "Manteiv"
            }
        else:
            return {
                "title": f"Breaking: Major Development in {category} Sector in Manteiv",
                "content": f"""Manteiv - In a surprising turn of events, major developments in the {category} sector have caught the attention of citizens nationwide. Local authorities have confirmed that the situation is unprecedented and requires immediate attention.
                
                Experts from various fields have weighed in on the matter, with many calling it a defining moment for the nation. "This is something we've never seen before in Manteiv," stated one prominent analyst.
                
                The government has assured citizens that all necessary measures are being taken to address the situation. Further updates are expected in the coming days as more information becomes available.
                
                This is a developing story and will be updated as more information becomes available.""",
                "category": category,
                "location": "Manteiv"
            }

ai_generator = AINewsGenerator()
