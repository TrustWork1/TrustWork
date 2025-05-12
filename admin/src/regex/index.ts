export default {
  emailRegex: /^[A-Z0-9._%+-]+@(?!yopmail\.)[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  password: /^[A-Z](?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,}$/,

  // password:
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  // name: /^[aA-zZ\s]+$/,
  name: /^[a-zA-Z\s']+$/u,

  phone: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
  cvvExpression: /^[0-9]+$/,
  cardNumberExpression: /^[0-9]+$/
}
