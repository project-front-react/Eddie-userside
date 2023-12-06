import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader'
import { emailVarificationApi } from "../../services/authServices"
import "./Verification.scss"
import { useHistory, useParams } from 'react-router-dom'
import { language } from '../../redux/actions'
import { useDispatch } from 'react-redux'
const Verification = () => {
    const [isLoader, setIsLoader] = useState(true)
    const [text, setText] = useState("We Are Verifying You...")
    const params = useParams()
    const history = useHistory()
    const dispatch=useDispatch();
    console.log("params", params);
    const getVarificationData = () => {
        emailVarificationApi(params?.id).then((result) => {
            if (result?.status == 'success') {
                setText('Verification Successfull! We Are Redirecting You To Login Page...')
                dispatch(language(params.lan));
                setTimeout(() => {
                    history.push('/login/')
                }, 3000);
            } else {
                setText('Verification failed...')
                setTimeout(() => {
                    history.push('/create-account/')
                }, 3000);
            }
        }).catch((e) => console.log(e))
    }

    useEffect(() => {
        getVarificationData()
    }, [])

    return (
        <div className='container verifyText'>

            <h2 className='text-center '>{text}</h2>

            {isLoader ? <Loader /> : ""}
        </div>
    )
}

export default Verification