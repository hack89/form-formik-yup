import React, {useState} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Error from './Error'
import Autosuggest from 'react-autosuggest'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Must have a character')
        .max(10, 'Must be shorter than 10')
        .required('Must enter a name'),
    
    email: Yup.string()
        .email('Must be a valid email')
        .required('Must enter an email'),
    country: Yup.string()
        .required('Must choose country')
})

const FormikForm = () => {
    const [country, setCountry] = useState('')
    const [suggestions, setSuggestions] = useState([])

    return (
        <Formik
            initialValues={{name: '', email: '', country: ''}}
            validationSchema={validationSchema}
            onSubmit={(values, {setSubmitting, resetForm})=>{
                setSubmitting(true)
                setTimeout(()=>{
                    alert(JSON.stringify(values, null, 2));
                    resetForm()
                    setSubmitting(false)
                    setCountry('')
                },500)
            }}
            >

            {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue})=> ( 
                
                <form onSubmit={handleSubmit}>
                
                    <div className="input-row">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text"
                            name='name'
                            id='name'
                            placeholder='enter name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={touched.name && errors.name ? 'has-error' : null}
                            />
                            <Error touched={touched.name} message={errors.name}/>
                    </div>
                    <div className="input-row">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            name='email'
                            id='email'
                            placeholder='enter email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={touched.email && errors.name ? 'has-error' : null}
                            />
                            <Error touched={touched.email} message={errors.email}/>
                    </div>
                    <div className="input-row">
                        <label htmlFor="country">Country</label>
                        <Autosuggest 
                            inputProps={{
                                placeholder: 'Type your country',
                                autoComplete: 'abcd',
                                name: 'country',
                                id: 'country',
                                value: country,
                                onChange: (e, {newValue})=> {
                                    setCountry(newValue)
                                },
                                className: touched.name && errors.name ? 'has-error' : null
                        }}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={async ({value}) => {
                            if(!value){
                                setSuggestions([]);
                                return;
                            }
                            try {
                                const res = await axios.get(`https://restcountries.eu/rest/v2/name/${value}`);
                                setSuggestions(res.data.map(row => {
                                    return {
                                            name: row.name,
                                            flag: row.flag
                                           }
                                }))
                            } catch(e){
                                setSuggestions([])
                            }
                        }}
                        onSuggestionsClearRequested={()=> {
                            setSuggestions([])
                        }}
                        onSuggestionSelected={(e, {suggestion, method})=> {
                            if(method === 'enter'){
                                e.preventDefault()
                            }
                            setCountry(suggestion.name)
                            setFieldValue('country', suggestion.name)
                        }}
                        getSuggestionValue={(suggestion)=> suggestion.name}
                        renderSuggestion={suggestion => (
                                <div>
                                    <img src={suggestion.flag} style={{width: '25px', marginRight: '6px'}} alt={suggestion.name}/>
                                    {suggestion.name}
                                </div>
                                )}
                        />
                        <Error touched={touched.country} message={errors.country}/>
                    </div>

                    <div className="input-row">
                        <button type="submit" disabled={isSubmitting}>Submit</button>
                    </div>
                </form>

            )}

        </Formik>
    )
}

export default FormikForm
