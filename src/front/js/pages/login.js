import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import "../../styles/login.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const onSubmitLogin = async () => {
        try {
            const successLogin = await actions.login(email, password);
            if (!successLogin) return console.error("Error en el inicio de sesión");

            const user = await actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;
            console.log("Usuario obtenido:", uid);

            const newListSuccess = await actions.getAllList(uid);
            if (!newListSuccess || !newListSuccess[0]?.id) return console.error("Error al cargar la lista");

            const lid = newListSuccess[0].id;

            const newGiftSuccess = await actions.getGiftToStore(uid, lid);
            if (newGiftSuccess === null) {
                console.warn("No gift found");
            }

            const newGiftAvailableSuccess = await actions.getGiftToStoreAvailable(uid, lid);
            if (newGiftAvailableSuccess === null) {
                console.warn("No available gift found");
            }

            const newGiftPurchasedSuccess = await actions.getGiftToStorePurchased(uid, lid);
            if (newGiftPurchasedSuccess === null) {
                console.warn("No purchased gift found");
            }

            console.log("Regalo agregado exitosamente");
            console.log("Lista cargada exitosamente");
            navigate(`/user/${uid}/giftlist/${lid}/allGifts`);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container text-center mt-5 d-flex justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmitLogin)}>
                <h1>Login</h1>
                <p>¿Nuevo? <Link to="/signup">Registrate</Link></p>
                <input type="text" {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                {errors.email?.type === 'required' && <p role="alert">Email is required to login</p>}
                {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                <input type="text"  {...register("password", {
                    required: true
                })} aria-invalid={errors.password ? "true" : "false"} value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                <button type="submit" className="btn btn-primary mt-3" >Submit</button>
            </form>
        </div>
    );
};