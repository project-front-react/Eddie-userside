import React, { useRef, useState, useEffect } from "react";
import "../ProfileMain.scss";
import { useDispatch, useSelector } from "react-redux";
import { tabPageNo, professionalInfo, loder } from "../../../redux/actions";
import { getTranslatedText as t } from "../../../translater/index";
import Loader from "../../../components/Loader/Loader";

export const ProfessionalInfo = () => {
  const stateProfile = useSelector((state) => state?.Profile);
  const dispatch = useDispatch();
  const stateEddi = useSelector((state) => state?.Eddi);
  const isCorporate = stateEddi?.UserDetail?.is_corporate
  let lan = stateEddi?.language;
  const [levelOfRoleError, setLevelOfRoleError] = useState("");
  const [currentRoleError, setCurrentRoleError] = useState("");
  const [corporateCodeError, setCorporateCodeError] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const currentRoleRef = useRef();
  const otherRoleRef = useRef();
  const curricularWantRef = useRef();
  const corporateCodeRef = useRef();
  const curricularHaveRef = useRef();
  const responsibilityRef = useRef();
  const levelRoleRef = useRef();
  const futureRoleRef = useRef();

  useEffect(() => {
    if ((levelOfRoleError == null && currentRoleError == null) && ((!isCorporate)||(isCorporate && !corporateCodeError))) {
      submitInfo();

    }
  }, [levelOfRoleError, currentRoleError,corporateCodeError]);

  const onNextClick = () => {
    const currentRoleVal = currentRoleRef?.current?.value;
    const levelRoleVal = levelRoleRef?.current?.value;
    const code = corporateCodeRef?.current?.value;

    if (currentRoleVal?.trim() == "") {
      setCurrentRoleError("* Current Professional Role is Required ");
    } else {
      setCurrentRoleError(null);
    }
    if (levelRoleVal?.trim() == "") {
      setLevelOfRoleError("* Level Of Role is Required ");
    } else {
      setLevelOfRoleError(null);
    } 
       if (isCorporate && code?.trim() == "") {
      setCorporateCodeError("* Corporate code is Required ");
    } else {
      setCorporateCodeError(null);
    }

  };


  const checkValid = ()=>{
    const currentRoleVal = currentRoleRef?.current?.value || "";
    const levelRoleVal = levelRoleRef?.current?.value || "";
    const code = corporateCodeRef?.current?.value;

    if (currentRoleVal?.trim() == "" ) {
      setCurrentRoleError("* Current Professional Role is Required ");
      return false
    } 
    else if (levelRoleVal?.trim() == "") {
      setLevelOfRoleError("* Level Of Role is Required ");
      return false
    }    else if (isCorporate && code?.trim() == "") {
      console.log(">>>>>",isCorporate);
      setCorporateCodeError("* Corporate code is Required ");
      return false
    }
     else {
      setLevelOfRoleError();
      setCurrentRoleError()
      setCorporateCodeError()
      console.log(">>>>",true);
      return true
    }
  }

  useEffect(()=>{
    var tab1 =document.getElementById('tab-1');
    var tab2 =document.getElementById('tab-2');
    var tab4 =document.getElementById('tab-4');
    tab1.addEventListener('click',async(e)=>{
      const valid = await checkValid()
      if(valid){
        dispatch(tabPageNo(1))
      }    })
    tab2.addEventListener('click',async(e)=>{
      const valid = await checkValid()
      if(valid){
        dispatch(tabPageNo(2))
      }    })
    tab4.addEventListener('click',async(e)=>{
      const valid = await checkValid()
      if(valid){
        dispatch(tabPageNo(4))
      }    })
    return (()=>{
    })
  },[])

  const submitInfo = () => {
    const currentRoleVal = currentRoleRef?.current?.value;
    const otherRoleVal = otherRoleRef?.current?.value;
    const curricularWantVal = curricularWantRef?.current?.value; 
    const corporateCodeVal = corporateCodeRef?.current?.value; 
    const curricularHaveVal = curricularHaveRef?.current?.value;
    const responsibilityVal = responsibilityRef?.current?.value;
    const levelRoleVal = levelRoleRef?.current?.value;
    const futureRoleVal = futureRoleRef?.current?.value;

    const professionalObj = {
      currentRole: currentRoleVal,
      otherRole: otherRoleVal,
      curricularWant: curricularWantVal,
      corporateCode: corporateCodeVal,
      curricularHave: curricularHaveVal,
      responsibility: responsibilityVal,
      levelRole: levelRoleVal,
      futureRole: futureRoleVal,
    };
    dispatch(professionalInfo(professionalObj));
    dispatch(tabPageNo(4));
  };

  const levelOfRole = [
    t("Coworker", lan),
    t("Teamleader", lan),
    t("Manager", lan),
    t("Executivemanager", lan),
  ];
  return (
    <>
      <div className="all-tab px-lg-5 px-md-2 px-sm-2 px-1">
        <div className="row m-0 px-lg-5 px-md-4 px-sm-2 px-1 mt-2">
          <div className="mt-3 col-md-6 col-sm-12 mb-3">
            <p className="p-head mb-1">
              {t("CurrentProfRole", lan)} <span className="text-danger">*</span>
            </p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterProfessional", lan)}
                ref={currentRoleRef}
                defaultValue={stateProfile.professionalData?.currentRole}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,currentRole:e?.target?.value}))}}
              />
            </div>
            {currentRoleError && (
              <p className="errorText mb-0">{currentRoleError}</p>
            )}
          </div>

          <div className="mt-3 col-md-6 col-sm-12 mb-3">
            <p className="p-head mb-1"> {t("otherRole", lan)} </p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterAdditonal", lan)}
                ref={otherRoleRef}
                defaultValue={stateProfile.professionalData?.otherRole}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,otherRole:e?.target?.value}))}}
              />
            </div>
          </div>
          <div className="mt-3 col-md-6 col-sm-12 mb-3">
            <p className="p-head mb-1">
              {t("LevelRole", lan)}
              <span className="text-danger">*</span>
            </p>
            <div>
              <select
                className="form-control input-profile select-profile px-2 py-3"
                placeholder={t("Choose", lan)}
                ref={levelRoleRef}
                defaultValue={stateProfile.professionalData?.levelRole ||""}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,levelRole:e?.target?.value}))}}

              >
                <option value={''}>{t("Choose", lan)} </option>
                {levelOfRole?.map((val, index) => {
                  return (
                    <option
                      key={index}
                      value={val}
                    >
                      {val}
                    </option>
                  );
                })}
                {/* <option selected={stateProfile.professionalData?.levelRole == "Manager" ? true : false}  >Manager</option>
                <option selected={stateProfile.professionalData?.levelRole == "Leader" ? true : false} >Leader</option> */}
              </select>
            </div>
            {levelOfRoleError && (
              <p className="errorText mb-0">{levelOfRoleError}</p>
            )}
          </div>
          <div className="mt-3 col-md-6 col-sm-12 mb-3">
            <p className="p-head mb-1"> {t("CoreResponsiblities", lan)}</p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterResponsiblities", lan)}
                ref={responsibilityRef}
                defaultValue={stateProfile.professionalData?.responsibility}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,responsibility:e?.target?.value}))}}
              />
            </div>
          </div>

          <div className={`mt-3 align-self-end col-lg-${isCorporate ? 4:6} col-md-6 col-sm-12 mb-3`}>
            <p className="p-head mb-1"> {t("FutureRole", lan)} </p>

            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterFuture", lan)}
                ref={futureRoleRef}
                defaultValue={stateProfile.professionalData?.futureRole}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,futureRole:e?.target?.value}))}}
              />
            </div>
          </div>

          <div className={`mt-3 align-self-end col-lg-${isCorporate ? 4:6} col-md-6 col-sm-12 mb-3`}>
            <p className="p-head mb-1"> {t("ExtraCurricular", lan)}</p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterExtraCurricular", lan)}
                ref={curricularWantRef}
                defaultValue={stateProfile.professionalData?.curricularWant}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,curricularWant:e?.target?.value}))}}

              />
            </div>
          </div>

        {isCorporate &&  <div className="mt-3 align-self-end col-lg-4 col-md-12 col-sm-12 mb-3">
            <p className="p-head mb-1"> {t("CorporateCode", lan)}
            <span className="text-danger">*</span>
            
            </p>
            <div>
              <input
                type="text"
                className="form-control input-profile px-2 py-3"
                placeholder={t("EnterCorporateCode", lan)}
                ref={corporateCodeRef}
                defaultValue={stateProfile.professionalData?.corporateCode}
                onChange={(e)=>{dispatch(professionalInfo({...stateProfile.professionalData,corporateCode:e?.target?.value}))}}

              />
                  {corporateCodeError && (
              <p className="errorText-code">{corporateCodeError}</p>
            )}
            </div>
          </div>
}
        </div>

        <div className="mt-4 px-lg-5 text-end mb-2  main-btn">
        {!isCorporate &&   <button
            id="skip1"
            onClick={onNextClick}
            className="btn btn-skip me-3 mb-3"
          >
            {t("Skip", lan)}
          </button>}

          <button
            onClick={onNextClick}
            className="btn btn-next me-2 mb-3"
            id="next-3"
          >
            {t("Next", lan)}
          </button>
        </div>
      </div>
      {/* {isLoader ? <Loader /> : ""} */}

    </>
  );
};

export default ProfessionalInfo;
