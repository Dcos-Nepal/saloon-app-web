const messages: any = ({
  'LOGIN_ERROR': ""
});

export const getMessage = (key: string) => {
  return messages[key];
}

