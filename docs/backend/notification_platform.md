# Notification Abstraction Platform

## Overview
A provider-agnostic notification bus.

## Supported Channels (Planned/Ready)
- Email (SMTP, SendGrid)
- SMS (Twilio, Gupshup)
- WhatsApp (Meta Graph API)
- Push Notifications (Firebase FCM)

Business logic modules only call `notificationPlatform.notify(type, payload)`, unaware of the underlying delivery provider.
