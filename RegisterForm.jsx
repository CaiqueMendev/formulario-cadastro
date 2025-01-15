import React, { useEffect } from 'react';
import { useForm, useController } from 'react-hook-form';
import Switch from 'react-switch';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';


// Form Field (types: {text-input, select})
const FormField = ({ name, control, label, type = "text", options = [], rules, colSize, placeholder, defaultOptionText = "Selecione", ...props }) => {
        
    const {
        field,
        fieldState: { error, isDirty },
    } = useController({
        name,
        control,
        rules,
        defaultValue: type === "select" ? "" : "",
    });

    
    

    return (
        <div className={`col-${colSize} d-flex flex-column mb-3`}>
            <label htmlFor={name} className="form-label">{label}</label>

            {type === "select" ? (
                <select
                    {...field}
                    id={name}
                    className={`form-control ${error ? "invalid" : (isDirty && field.value && !error) ? "valid" : ""}`}
                    style={{
                        color: field.value === "" ? "#D2D2D2" : "#494A4E",
                    }}
                    {...props}
                >
                    <option value="" disabled>{defaultOptionText}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    {...field}
                    id={name}
                    type={type}
                    className={`form-control ${error ? "invalid" : (isDirty && field.value && !error) ? "valid" : ""}`}
                    placeholder={placeholder}
                    {...props}
                />
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </div>
    );
};


// Masked date input
const MaskedDateInput = React.forwardRef(({ value, onChange, onClick }, ref) => (
    <InputMask
        mask="99/99/9999"
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder="__/__/____"
        ref={ref}
        className='form-control'
    />
));
MaskedDateInput.displayName = 'MaskedDateInput';

const DateField = ({ name, control, label, colSize,...props }) => {
    const { field } = useController({ name, control });

    return (
        <div className={`col-${colSize} d-flex flex-column mb-3`}>
            <label htmlFor={name} className="form-label">{label}</label>
        
            <ReactDatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                customInput={<MaskedDateInput />}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                {...props}
            />
        </div>
    );
};


// mask inputs (cpf, cnpj, celular, telefone, cep)
const MaskField = ({ name, control, label, rules, placeholder, type, colSize, mask, ...props }) => {
    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { error, isDirty },
    } = useController({
        name,
        control,
        rules,
    });

    return (
        <div className={`col-${colSize} d-flex flex-column mb-3`}>
            <label htmlFor={name} className='form-label'> {label}</label>
            <InputMask
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                mask={mask}
                placeholder={placeholder}
                type={type}
                className={`form-control ${error ? "invalid" : (isDirty && value && !error) ? "valid" : ""}`}
                inputRef={ref}              
                {...props}
            />
            {error && <div className="invalid-feedback">{error.message}</div>}
        </div>
    );
};

// switch (semCPF)
const SwitchField = ({ name, control, label }) => {
    const {
        field: { value, onChange },
    } = useController({
        name,
        control,
        defaultValue: false,
    });

    return (
        <div className='d-flex align-items-center mb-3 w-auto gap-4 form-label'>
            <label className='ms-2'>{label}</label>
            <Switch
                checked={value}
                onChange={onChange}
                offColor='#A1A1A1'
                onColor='#4CAF50'
                offHandleColor='#DDD'
                onHandleColor='#444444'
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                borderRadius={20}
            />
            
        </div>
    );
};



// ================================================================================


function RegisterForm() {
    const { control, watch, setValue, handleSubmit, clearErrors, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            confirmaEmail: "",
            tipoPessoa: "",
            semCPF: false,
            celular: "",
            telefone: "",
            cpf: "",
        },       
    });   

    const tipoPessoa = watch("tipoPessoa");
    const semCPF = watch("semCPF");
    const email = watch("email");
    
    useEffect(() => {
        if (semCPF) {
            setValue("cpf", "");
        }
    }, [semCPF, setValue]);

    useEffect(() => {
        clearErrors("confirmaEmail");
    }, [email, clearErrors]);

    
    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="container position-relative px-0">
            
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='container position-relative form-container px-0'>
                        <div className="form-tittle position-absolute rounded-3 bg-black text-white mx-5 px-5 lh-1 py-3 w-auto">
                            <p>Dados Pessoais</p>
                        </div>
                        <div className="bg-white container rounded-4 my-3 px-5 pt-5 pb-3">
                            <div className="row">
                                <FormField
                                    name="tipoPessoa"
                                    control={control}
                                    label="Tipo de Pessoa"
                                    type="select"
                                    options={[
                                        { value: "fisica", label: "Pessoa Física" },
                                        { value: "juridica", label: "Pessoa Jurídica" },
                                    ]}
                                    colSize={2}
                                />
                                <FormField
                                    name="nomeCompleto"
                                    control={control}
                                    label="Nome Completo"
                                    type="text"
                                    colSize={5}
                                />

                                {(tipoPessoa === "fisica" || tipoPessoa === "") &&  (
                                    <MaskField
                                        name="cpf"
                                        control={control}
                                        label="CPF"
                                        mask="999.999.999-99"
                                        placeholder="___.___.___-__"
                                        colSize={2}
                                        rules={{validate: (value) => value.lenght === 11 || "CPF deve estar completo."}}
                                        disabled={semCPF}
                                    />
                                    
                                    
                                )}

                                {tipoPessoa === "juridica" && (
                                    
                                    <MaskField
                                        name="cnpj"
                                        control={control}
                                        label="CNPJ"
                                        placeholder="__.___.___/____-__"
                                        mask="99.999.999/9999-99"
                                        colSize={2}
                                    />
                                    
                                )}

                                <SwitchField
                                    name="semCPF"
                                    control={control}
                                    label="Cidadão não possui CPF:"
                                    colSize={3}
                                />                 
                            </div>

                            <div className="row">
                                <FormField
                                    name="escolaridade"
                                    control={control}
                                    label="Escolaridade"
                                    type="select"
                                    options={[
                                        { value: "fundamental", label: "Ensino Fundamental" },
                                        { value: "medio", label: "Ensino Médio" },
                                        { value: "superior", label: "Ensino Superior" },
                                        { value: "doutorado_mestrado", label: "Doutorado/Mestrado" },
                                        { value: "posgraduacao", label: "Pós-Graduação" },
                                        { value: "ensinoinformal", label: "Sem Instrução Formal" },
                                    ]}
                                    colSize={5}
                                />
                                <FormField
                                    name="profissao"
                                    control={control}
                                    label="Profissão"
                                    type="text"
                                    colSize={4}
                                />
                                <DateField
                                    name="nascimento"
                                    control={control}
                                    type="date"
                                    label="Data de Nascimento"
                                    colSize={3}
                                />
                                        
                            </div>

                            <div className="row">
                                <FormField
                                    name="email"
                                    control={control}
                                    label="E-mail"
                                    type="email"
                                    rules={{ 
                                        required: "Esse campo é obrigatório",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Formato de e-mail inválido",
                                        },
                                     }}
                                    colSize={6}
                                />
                                <FormField
                                    name="confirmaEmail"
                                    control={control}
                                    label="Confirme o e-mail"
                                    type="email"
                                    rules={{ 
                                        required: "Esse campo é obrigatório",
                                        validate: (value) => value === watch("email") || "Os e-mails não coincidem",
                                    }}
                                    colSize={6}
                                />
            
                            </div>

                            <div className="row">
                                <FormField
                                    name="tipoCelular"
                                    control={control}
                                    label="Tipo de Celular"
                                    type="select"
                                    options={[
                                        { value: "pessoal", label: "Pessoal" },
                                        { value: "comercial", label: "Comercial" },
                                        { value: "residencial", label: "Residencial" },
                                    ]}
                                    rules={{ required: "Esse campo é obrigatório" }}
                                    colSize={2}
                                />
                                <MaskField
                                    name="celular"
                                    control={control}
                                    label="Celular"
                                    mask="(99) 99999-9999"
                                    placeholder="(__) _____-____"
                                    rules={{ 
                                        required: "Esse campo é obrigatório",
                                     }}
                                    colSize={4}
                                    className={`form-control input-mask`}
                                />
                                <FormField
                                    name="tipoTelefone"
                                    control={control}
                                    label="Tipo de Telefone"
                                    type="select"
                                    options={[
                                        { value: "pessoal", label: "Pessoal" },
                                        { value: "comercial", label: "Comercial" },
                                        { value: "residencial", label: "Residencial" },
                                    ]}
                                    colSize={2}
                                />
                                <MaskField
                                    name="telefone"
                                    control={control}
                                    label="Telefone"
                                    placeholder="(__) ____-____"
                                    mask="(99) 9999-9999"
                                    colSize={4}
                                />

                                        
                            </div>
                        </div>
                    
                        
                    </div>

                    <div className='container position-relative form-container px-0'>
                        <div className="form-tittle position-absolute rounded-3 bg-black text-white mx-5 px-5 lh-1 py-3 w-auto">
                            <p>Endereço</p>
                        </div>
                        <div className="bg-white container rounded-4 my-3 px-5 pt-5 pb-3">
                            <div className="row">
                                <FormField
                                    name="endereco"
                                    control={control}
                                    label="Endereço"
                                    type="text"
                                    colSize={7}
                                />
                                <FormField
                                    name="numero"
                                    control={control}
                                    label="Número"
                                    type="text"
                                    colSize={1}
                                />
                                <FormField
                                    name="complemento"
                                    control={control}
                                    label="Complemento"
                                    type="text"
                                    colSize={4}
                                />
                                        
                            </div>

                            <div className="row">
                                <FormField
                                    name="bairro"
                                    control={control}
                                    label="Bairro"
                                    type="text"
                                    colSize={5}
                                />
                                <FormField
                                    name="uf"
                                    control={control}
                                    label="UF"
                                    type="select"
                                    options={
                                        [{ value: "ac", label: "AC" },
                                            { value: "al", label: "AL" },
                                            { value: "ap", label: "AP" },
                                            { value: "am", label: "AM" },
                                            { value: "ba", label: "BA" },
                                            { value: "ce", label: "CE" },
                                            { value: "df", label: "DF" },
                                            { value: "es", label: "ES" },
                                            { value: "go", label: "GO" },
                                            { value: "ma", label: "MA" },
                                            { value: "mt", label: "MT" },
                                            { value: "ms", label: "MS" },
                                            { value: "mg", label: "MG" },
                                            { value: "pa", label: "PA" },
                                            { value: "pb", label: "PB" },
                                            { value: "pr", label: "PR" },
                                            { value: "pe", label: "PE" },
                                            { value: "pi", label: "PI" },
                                            { value: "rj", label: "RJ" },
                                            { value: "rn", label: "RN" },
                                            { value: "rs", label: "RS" },
                                            { value: "ro", label: "RO" },
                                            { value: "rr", label: "RR" },
                                            { value: "sc", label: "SC" },
                                            { value: "sp", label: "SP" },
                                            { value: "se", label: "SE" },
                                            { value: "to", label: "TO" },]
                                    }   
                                    colSize={1}
                                    defaultOptionText='--'
                                />
                                <FormField
                                    name="cidade"
                                    control={control}
                                    label="Cidade"
                                    type="text"
                                    colSize={4}
                                />
                                <MaskField
                                    name="cep"
                                    control={control}
                                    label="CEP"
                                    placeholder="__.___-___"
                                    mask="99.999-999"
                                    colSize={2}
                                />
                                        
                            </div>
                            
                        </div>
                    </div>           
                    <button className='btn btn-primary' type='submit' >Cadastrar</button>
                </form>
            
        </div>
    );
}

export default RegisterForm;
