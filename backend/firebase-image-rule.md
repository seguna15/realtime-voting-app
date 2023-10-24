# Firebase upload rule

```JSON
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 *1024* 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
```
