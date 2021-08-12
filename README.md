# Chef_task_schedule_app
React native app that helps restaurant chefs to schedule and organize orders.

Find /stripped release/stripped-release.apk for stripped down app without cloud api integration.
Lot of bugs without cloud api keys

Description

Scan an receipt order and using google's ML vision we can use image to text.
The Text is then organised by comparing with a dish database and an order list is formed.
The useState hook constantly refreshes as order list changes.
Using graphQL subscriptions the the data is stored in the cloud and sent to other devices.
The chef can swipe up on completed dishes and eventually complete the order.
