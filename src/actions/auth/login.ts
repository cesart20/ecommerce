

'use server';
 
import { sleep } from '@/utils';
import { signIn } from '../../../auth.config';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // sleep(6);
    
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Success';


  } catch (error) {

    if (( error as any ).type === 'CredentialsSignin') {
      return 'Invalid credentials.';
    }

    return 'UnknownError';

  }
}