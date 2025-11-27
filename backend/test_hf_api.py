"""
Quick test of Hugging Face API for lyrics generation
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_token = os.getenv('HUGGINGFACE_API_TOKEN')

if not api_token or api_token == 'hf_your_huggingface_token_here':
    print("❌ No valid API token found")
    exit(1)

print(f"✅ Token found: {api_token[:10]}...")

# Test with GPT-2 (most reliable)
models = ["gpt2", "gpt2-large"]

for model in models:
    print(f"\n{'='*60}")
    print(f"Testing: {model}")
    print('='*60)
    
    # Try serverless inference endpoint
    api_url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    prompt = """Write a pop song about love and dreams:

[Verse 1]"""
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.9,
            "do_sample": True,
            "return_full_text": False
        },
        "options": {
            "wait_for_model": True
        }
    }
    
    try:
        print(f"Sending request...")
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Response type: {type(result)}")
            print(f"Response: {result}")
            
            if isinstance(result, list) and len(result) > 0:
                text = result[0].get('generated_text', '')
                print(f"\n✅ Generated text ({len(text)} chars):")
                print(text[:300])
                break
        else:
            print(f"Error: {response.text[:500]}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
