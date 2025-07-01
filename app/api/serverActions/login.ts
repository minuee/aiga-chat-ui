
export const signInWithCredentials = async (formData: FormData) => {
    try {
      /* await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        // redirectTo: '/'  <= 이 속성은 try 문 안에서 동작하지 않습니다! Beta?
      }) */
      // 로그인에 성공하면, 리다이렉션을 에러 캐치로 처리하므로 이 위치에 실행할 코드를 추가하지 마세요! Beta?
    } catch (error) {
      // @ts-ignore-next-line // 아직 해당 타입이 없어 무시합니다. // if (error instanceof CredentialsSignin)
      //throw new Error(error.cause.err.message)
      console.log(error)
    }
    //redirect('/') // 또는 return { message: '메시지!' }
  }