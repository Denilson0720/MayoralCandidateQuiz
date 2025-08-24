# Database Setup Guide

## 🔧 **Environment Configuration**

### **1. Create Environment File**
Create a `.env.local` file in your project root with your database connection:

```bash
# .env.local
DATABASE_URL="postgresql://your-username:your-password@ep-something.region.aws.neon.tech/neondb?sslmode=require"
```

### **2. Get Your Neon Connection String**
1. Go to your Neon dashboard
2. Select your project
3. Click "Connection Details"
4. Copy the connection string
5. Replace the placeholder in `.env.local`

### **3. Install Dependencies**
```bash
npm install
```

## 🚀 **Testing the Integration**

### **1. Start the Development Server**
```bash
npm run dev
```

### **2. Take a Quiz**
1. Go to your quiz application
2. Complete a quiz
3. Check the browser console for success messages
4. Check your database for new records

### **3. Verify Database Records**
Run these queries in your database to verify data is being saved:

```sql
-- Check quiz results
SELECT * FROM quiz_results ORDER BY timestamp DESC LIMIT 5;

-- Check individual answers
SELECT * FROM quiz_answers ORDER BY created_at DESC LIMIT 10;

-- Check candidate popularity
SELECT * FROM candidate_popularity;
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Connection Error**: Check your DATABASE_URL format
2. **SSL Error**: Ensure `sslmode=require` is in your connection string
3. **Permission Error**: Verify your database user has INSERT permissions
4. **CORS Error**: Ensure your API routes are properly configured

### **Debug Steps:**
1. Check browser console for errors
2. Check server logs for database errors
3. Verify environment variables are loaded
4. Test database connection manually

## 📊 **What Gets Saved**

### **Quiz Results Table:**
- Total questions and answered questions
- Completion percentage
- Selected categories (JSON)
- Candidate matches (JSON)
- User agent and IP address
- Timestamp

### **Quiz Answers Table:**
- Individual answer selections
- Links to questions and options
- Quiz result ID for grouping

## 🎯 **Next Steps**

Once the integration is working:
1. Test with multiple quiz attempts
2. Verify candidate matching accuracy
3. Check analytics queries
4. Build the dashboard using the analytics queries
