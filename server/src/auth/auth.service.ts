import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async generateKey() {
    try {
      const id = uuidv4();
      const body = JSON.stringify({
        keyName: id.toString(),
        permissions: {
          endpoints: {
            pinning: {
              pinFileToIPFS: true
            }
          }
        },
        maxUses: 1
      });
      const { data: keyRes } = await firstValueFrom(
        this.httpService.post(process.env.PINATA_GENERATE_API_KEY, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            'content-type': 'application/json'
          }
        })
      );
      const keyData = {
        pinata_api_key: keyRes.pinata_api_key,
        JWT: keyRes.JWT
      };
      return keyData;
    } catch (error) {
      console.log(error);
      throw Error('Error creating API Key');
    }
  }

  async revokeKey(keyId: string) {
    const keyData = JSON.stringify({
      apiKey: keyId
    });
    try {
      const { data: keyDelete } = await firstValueFrom(
        this.httpService.put(process.env.PINATA_REVOKE_API_KEY, keyData, {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${process.env.PINATA_JWT}`
          }
        })
      );
      return { success: true };
    } catch (error) {
      throw Error('Error Deleting API Key');
    }
  }
}
