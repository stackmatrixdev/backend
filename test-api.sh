#!/bin/bash

echo "🧪 Testing Document Upload/Fetch Flow..."
echo ""

# Test if server is running
echo "1️⃣ Testing if backend server is running..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/programs)

if [ "$response" = "200" ]; then
    echo "✅ Server is running (Status: $response)"
else
    echo "❌ Server not running or not responding (Status: $response)"
    echo "   Start server with: cd /home/root_coder/Downloads/demo/backend && npm start"
    exit 1
fi

echo ""
echo "2️⃣ Testing programs endpoint..."
programs=$(curl -s http://localhost:5000/api/programs | jq -r '.data[0]._id // "none"')

if [ "$programs" != "none" ]; then
    echo "✅ Found program: $programs"
    
    echo ""
    echo "3️⃣ Testing documents endpoint for program $programs..."
    docs=$(curl -s http://localhost:5000/api/programs/$programs/documents)
    
    echo "Documents response:"
    echo "$docs" | jq '.'
    
    free_count=$(echo "$docs" | jq -r '.data.free | length // 0')
    premium_count=$(echo "$docs" | jq -r '.data.premium | length // 0')
    
    echo ""
    echo "📊 Document Summary:"
    echo "   Free documents: $free_count"
    echo "   Premium documents: $premium_count"
    
    if [ "$free_count" -gt 0 ] || [ "$premium_count" -gt 0 ]; then
        echo "✅ Documents found! The API is working correctly."
        echo ""
        echo "🎯 If you can't see documents in the UI, check:"
        echo "   1. Are you viewing the same program ID: $programs"
        echo "   2. Check browser console for errors"
        echo "   3. Clear browser cache (Ctrl+Shift+R)"
    else
        echo "⚠️  No documents found. Try uploading one first."
    fi
else
    echo "❌ No programs found in database"
fi

echo ""
echo "🏁 Test complete!"