import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string): string => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay seed JWT");
  }

  return jwt.sign(
    // payload
    { _id, email },
    // seed
    process.env.JWT_SECRET_SEED,
    // options
    { expiresIn: "30d" }
  );
};


export const isValidToken = (token:string):Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay seed JWT");
  }
  return new Promise<string>((resolve, reject) => {

   try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err ,payload) => {
          if (err) return reject('JWT no valido')
          const { _id } = payload as {_id: string}
          resolve(_id)
      })
   } catch (error) {
     reject('Hubo un error con el JWT ' + error)
   }

    
  })
}