import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-test',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {

  users_list = [
    {
      "firstName": "John",
      "lastName": "Doe",
      "username": "john.doe@example.com",
      "password": {
        "$binary": {
          "base64": "JDJiJDEyJE1XNVlNTm80alNkQVdxRlVGS3I4MmVjRUhqb2w5dVdSbU5SQ1BwaWxVQ2FmNnhOOWpxMVEu",
          "subType": "00"
        }
      },
      "phone": "123-456-7890",
      "address": "123 Main St, Anytown, USA",
      "DOB": "1990-01-01",
      "admin": false,
      "emailVerified": true,
      "phoneVerified": false,
      "status": "active",
      "createdAt": "2025-01-22T10:00:00Z",
      "lastLoginAt": "2025-01-22T10:00:00Z"
    },
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "jane.smith@example.com",
      "password": {
        "$binary": {
          "base64": "JDJiJDEyJFpLeThXeFlYT0E2a1kwN011NEZmRE9jNVZuNjRRZEhyR0g2clFZaFV5UWVZd1RMZGtyRkky",
          "subType": "00"
        }
      },
      "phone": "123-456-7890",
      "address": "123 Main St, Anytown, USA",
      "DOB": "1990-01-01",
      "admin": false,
      "emailVerified": true,
      "phoneVerified": true,
      "status": "active",
      "createdAt": "2025-01-22T10:00:00Z",
      "lastLoginAt": "2025-01-22T10:00:00Z"
    },
    {
      "firstName": "Bob",
      "lastName": "Johnson",
      "username": "bob.johnson@example.com",
      "password": {
        "$binary": {
          "base64": "JDJiJDEyJFBhdnBSNzg0VEljbUFnbXpMMk5CRU9ZNXB1V2NlMGdDTElpNElqeHFUNTg4SS50dC5tSVYy",
          "subType": "00"
        }
      },
      "phone": "123-456-7890",
      "address": "123 Main St, Anytown, USA",
      "DOB": "1990-01-01",
      "admin": false,
      "emailVerified": false,
      "phoneVerified": true,
      "status": "active",
      "createdAt": "2025-01-22T10:00:00Z",
      "lastLoginAt": "2025-01-22T10:00:00Z"
    },
    {
      "firstName": "Test",
      "lastName": "User",
      "username": "testuser@example.com",
      "password": {
        "$binary": {
          "base64": "JDJiJDEyJFZwRzh0Zzd4b0xSdTczVUpSVmdvNS51aFNmdE9BcWZGWVVKcTJ4RlhPem1rQlZRbmx2MzRT",
          "subType": "00"
        }
      },
      "phone": "123-456-789",
      "address": "123 Fake Street",
      "DOB": "1999-01-01",
      "admin": false,
      "emailVerified": false,
      "phoneVerified": false,
      "status": "active",
      "createdAt": "2026-02-02T18:59:55.647849+00:00",
      "lastLoginAt": "2026-02-02T18:59:55.647865+00:00"
    }
  ]
}
