import { Title } from "@/components";
import { auth } from "../../../../auth.config";
import { redirect } from "next/navigation";



export default async function ProfilePage() {
  
  const session = await auth();

  if ( !session?.user ) {
    // redirect('/auth/login?returnTo=/perfil');

    redirect('/');
  }
  
  return (
    <div>
      <Title title="Mi perfil" />

      {
        <pre>
          { JSON.stringify( session.user, null, 2 ) }
        </pre>
      }
    </div>
  )
}
