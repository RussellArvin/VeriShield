---
title: Content Verification API
summary: Verify the authenticity and truthfulness of digital content using AI analysis
version: v1.2.0
updatedAt: "2025-01-15"
endpoint: https://api.verishield.com/v1/verify
method: POST
parameters:
  - name: content
    type: string
    description: The text content to verify
    required: true
  - name: url
    type: string
    description: URL to content that needs verification
    required: false
  - name: contextual_data
    type: object
    description: Additional contextual information to improve verification accuracy
    required: false
  - name: analysis_level
    type: string
    description: Depth of analysis (basic, standard, deep)
    required: false
examples:
  - title: Verify Text Content
    description: Basic request to verify a text statement
    code: |
      curl -X POST https://api.verishield.com/v1/verify \
        -H "Authorization: Bearer YOUR_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "content": "Scientists have confirmed that climate change is primarily caused by human activities."
        }'
  - title: Verify with Context
    description: Verification with additional context for better accuracy
    code: |
      curl -X POST https://api.verishield.com/v1/verify \
        -H "Authorization: Bearer YOUR_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "content": "The new healthcare bill will reduce costs for all Americans.",
          "contextual_data": {
            "domain": "politics",
            "region": "united_states",
            "timeframe": "current"
          },
          "analysis_level": "deep"
        }'
responseExample: |
  {
    "verification_id": "ver_1234567890",
    "content": "Scientists have confirmed that climate change is primarily caused by human activities.",
    "verdict": {
      "classification": "SUPPORTED",
      "confidence": 0.92,
      "explanation": "This statement is supported by scientific consensus. Multiple peer-reviewed studies and reports from major scientific organizations including the IPCC have confirmed human activity as the primary driver of observed climate change."
    },
    "evidence": [
      {
        "source": "Intergovernmental Panel on Climate Change",
        "url": "https://www.ipcc.ch/report/ar6/wg1/",
        "relevance": 0.95
      },
      {
        "source": "NASA Global Climate Change",
        "url": "https://climate.nasa.gov/scientific-consensus/",
        "relevance": 0.92
      }
    ],
    "analysis_metadata": {
      "processing_time": "0.823s",
      "model_version": "vs-verification-5.2.1",
      "timestamp": "2025-01-15T14:23:10Z"
    }
  }
---

# Content Verification API

The Content Verification API helps you determine the factual accuracy of text-based claims and statements using VeriShield's advanced AI analysis capabilities.

## Overview

This API endpoint analyzes content to determine its truthfulness by cross-referencing with known facts, checking for logical consistency, and identifying patterns associated with misinformation. The service provides a detailed verdict along with supporting evidence and confidence scores.

## Authentication

All API requests require authentication using your VeriShield API key. Include the key in the Authorization header of your requests:

```
Authorization: Bearer YOUR_API_KEY
```

To obtain an API key, register for a VeriShield account and create a key in the developer dashboard.

## Request Format

The API accepts content for verification in several formats:

- Direct text submission
- URL to webpage containing content
- Structured data with additional context

When possible, providing contextual information improves verification accuracy.

## Response Verdicts

The API returns one of these classification verdicts:

| Classification | Description |
|----------------|-------------|
| SUPPORTED | Statement is supported by evidence and considered factually accurate |
| CONTRADICTED | Statement is contradicted by evidence and considered inaccurate |
| INSUFFICIENT_EVIDENCE | Not enough evidence to verify or contradicting evidence exists |
| MISLEADING | Statement contains some truth but is presented in a misleading context |
| OPINION | Statement is subjective and cannot be factually verified |
| SATIRE | Content appears to be satirical rather than factual |

## Best Practices

For optimal results:

1. Submit complete statements rather than fragments
2. Provide as much context as possible
3. Use the `analysis_level` parameter for sensitive or complex topics
4. Consider the confidence score when making decisions

## Rate Limits

- Free tier: 100 verifications per day
- Standard tier: 1,000 verifications per day
- Enterprise tier: Custom limits

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

- 200: Success
- 400: Bad request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 429: Rate limit exceeded
- 500: Server error

For error responses, the response body will contain detailed information about the error.