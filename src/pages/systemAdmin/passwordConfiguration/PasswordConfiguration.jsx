import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './PasswordConfiguration.module.css';

import { fetchPasswordConfiguration, upsertPasswordConfiguration } from '../../../services/systemAdmin/PasswordConfigurationService';
import 'react-toastify/dist/ReactToastify.css';
 
const complexityRequirements = {
  Low: 'Must contain: uppercase and lowercase letters. No digits or special characters required.',
  Medium: 'Must contain: uppercase, lowercase letters, and digits. Special characters optional.',
  High: 'Must contain: uppercase, lowercase letters, digits, and special characters.'
};

const complexityDefaults = {
  Low: {
    minPwdLength: 6,
    maxPwdTenure: 90,
    pwdHistory: 5,
    wrongAttemptLimit: 3,
    pwdComplexity: 'Low',
    pwdChangeAlert: 7,
    idealSessionTime: 15
  },
  Medium: {
    minPwdLength: 8,
    maxPwdTenure: 90,
    pwdHistory: 5,
    wrongAttemptLimit: 3,
    pwdComplexity: 'Medium',
    pwdChangeAlert: 7,
    idealSessionTime: 15
  },
  High: {
    minPwdLength: 12,
    maxPwdTenure: 90,
    pwdHistory: 5,
    wrongAttemptLimit: 3,
    pwdComplexity: 'High',
    pwdChangeAlert: 7,
    idealSessionTime: 15
  }
};

const defaultConfig = complexityDefaults['Low']  ;

const PasswordConfiguration = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleComplexityChange = (value) => {
    setConfig(prev => ({
      ...prev,
      pwdComplexity: value
    }));
    setErrors(prev => ({ ...prev, pwdComplexity: '' }));
  };

  const loadConfigData = async () => {
    try {
      const data = await fetchPasswordConfiguration();
      const configData = data?.passwordConfiguration;

      if (configData && Object.keys(configData).length > 0) {
        setConfig({
          minPwdLength: configData.minimumPasswordLength,
          maxPwdTenure: configData.maximumPasswordTenure,
          pwdHistory: configData.passwordHistory,
          wrongAttemptLimit: configData.wrongAttemptLimit,
          pwdComplexity: configData.passwordComplexity,
          pwdChangeAlert: configData.passwordChangeAlert,
          idealSessionTime: configData.idealSessionTime
        });
      } else {
        setConfig(defaultConfig);
      }
      
    } catch (error) {
      console.error('Error fetching configuration:', error);
      toast.error('An error occurred while fetching configuration.');
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(config).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newErrors[key] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const payload = {
      minimumPasswordLength: parseInt(config.minPwdLength),
      maximumPasswordTenure: parseInt(config.maxPwdTenure),
      passwordHistory: parseInt(config.pwdHistory),
      wrongAttemptLimit: parseInt(config.wrongAttemptLimit),
      passwordComplexity: config.pwdComplexity,
      passwordChangeAlert: parseInt(config.pwdChangeAlert),
      idealSessionTime: parseInt(config.idealSessionTime),
      createdBy: "Admin",
      plantID: 0,
      reasonForChange: config.reasonForChange,
      electronicSignature: "AdminSignature",
      signatureDate: new Date().toISOString()
    };

    try {
      const result = await upsertPasswordConfiguration(payload);
      console.log('Configuration saved successfully:', result);
      toast.success('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration.');
    }
  };

  useEffect(() => {
    loadConfigData();
  }, []);

  return (
    <>
      

      <div className={styles.container}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className={styles.loader}></div>
            <p>Loading Password Configuration...</p>
          </div>
        )}
        {!isLoading && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>Password Configuration</h2>

            {/* Fields */}
            {[
              {
                name: "minPwdLength",
                label: "Minimum Password Length",
                desc: "Minimum number of characters required"
              },
              {
                name: "maxPwdTenure",
                label: "Password Expiry (in days)",
                desc: "Duration password stays valid"
              },
              {
                name: "pwdHistory",
                label: "Password History",
                desc: "Number of old passwords remembered to prevent reuse"
              },
              {
                name: "wrongAttemptLimit",
                label: "Wrong Attempt Limit",
                desc: "Number of wrong login attempts allowed before account lock"
              },
              {
                name: "pwdChangeAlert",
                label: "Password Change Alert (days before expiry)",
                desc: "Alert user before password expires"
              },
              {
                name: "idealSessionTime",
                label: "Ideal Session Time (in minutes)",
                desc: "Time before user is auto-logged out"
              }
            ].map(({ name, label, desc }) => (
              <div className={styles.field} key={name}>
                <label>
                  {label}<span style={{ color: 'red' }}>*</span><br />
                  <span className={styles.desc}>({desc})</span>
                </label>
                <input
                  type="number"
                  name={name}
                  value={config[name]}
                  onChange={handleChange}
                  className={errors[name] ? styles.errorInput : ''}
                  required
                />
                {errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
              </div>
            ))}

<div className={styles.field}>
  <label>
    Password Complexity<span style={{ color: 'red' }}>*</span><br />
    
  </label>
  <div className={styles.radiobuttons}>
    {[
      { label: 'Low', desc: 'Only letters and numbers' },
      { label: 'Medium', desc: 'Letters, numbers & one special character' },
      { label: 'High', desc: 'Uppercase, lowercase, numbers & special characters' }
    ].map(({ label, desc }) => (
      <div key={label} className={styles.radioWrapper}>
        <label>
          <input
            type="radio"
            name="pwdComplexity"
            checked={config.pwdComplexity === label}
            onChange={() => handleComplexityChange(label)}
            required
          />
          {label}
        </label>
        <div className={styles.radioDesc}>{desc}</div>
      </div>
    ))}
  </div>
  
  {errors.pwdComplexity && <p className={styles.errorText}>{errors.pwdComplexity}</p>}
</div>


            <button type="submit" className={styles.submitBtn}>Save Configuration</button>
          </form>
        )}
      </div>
    </>
  );
};

export default PasswordConfiguration;

