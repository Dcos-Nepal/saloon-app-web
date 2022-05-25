import { useNavigate } from 'react-router-dom';
import LogoFull from 'assets/images/LogoFull.svg';
import { ArrowLeftIcon } from '@primer/octicons-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { Loader } from 'common/components/atoms/Loader';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("privacy-policy.md")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid txt-grey">
      <div className="d-flex justify-content-center px-5">
        <div className="mt-5">
          <div className="d-flex justify-content-center mb-4">
            <img src={LogoFull} alt="Orange Cleaning" style={{ height: '145px' }} />
          </div>
          <div className="main-container card bg-white p-4" style={{maxWidth: '900px', position: 'relative', minHeight: '500px'}}>
            <Loader isLoading={isLoading} />
            <ReactMarkdown children={content}/>
          </div>
          <div className='mb-5 mt-5 text-center'>
            <span className='cursor-pointer txt-orange' onClick={() => navigate(-1)}><ArrowLeftIcon /> Go Back</span>
          </div>

          <div className='mb-5 mt-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
