import streamlit as st
import google.generativeai as genai

# Konfiguracja wyglądu strony (dostosowana do telefonów)
st.set_page_config(page_title="Asystent Prawny", page_icon="⚖️")

# Pobieranie klucza API z bezpiecznych ustawień (Secrets)
if "GOOGLE_API_KEY" not in st.secrets:
    st.error("Błąd: Nie znaleziono klucza API w ustawieniach Streamlit.")
    st.stop()

genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])

st.title("⚖️ Kalkulator Opłat Sądowych")
st.write("Wprowadź dane sprawy, aby uzyskać komentarz ekspercki.")

# Formularz wprowadzania danych
case_type = st.text_input("Rodzaj sprawy (np. o zapłatę, o wydanie nieruchomości):", "o zapłatę")
wps = st.number_input("Wartość przedmiotu sporu (zł):", min_value=0, value=10000)
calculated_fee = st.number_input("Wyliczona opłata sądowa (zł):", min_value=0, value=500)

if st.button("Generuj wyjaśnienie"):
    if not case_type:
        st.warning("Proszę podać rodzaj sprawy.")
    else:
        with st.spinner('Trwa generowanie odpowiedzi przez AI...'):
            try:
                # Wykorzystujemy model Gemini 1.5 Flash (szybki i darmowy)
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # Twój konkretny prompt z Google AI Studio
                prompt = (
                    f"Jako ekspert od polskiego prawa cywilnego, krótko wyjaśnij dlaczego opłata sądowa "
                    f"dla sprawy typu '{case_type}' przy wartości przedmiotu sporu {wps} zł wynosi {calculated_fee} zł. "
                    f"Wspomnij o istotnych terminach płatności lub możliwości zwolnienia z kosztów. "
                    f"Odpowiedz zwięźle w języku polskim w formacie Markdown."
                )
                
                response = model.generate_content(prompt)
                
                st.markdown("---")
                st.markdown("### Komentarz eksperta:")
                st.markdown(response.text)
                
            except Exception as e:
                st.error(f"Wystąpił problem z połączeniem: {e}")

st.caption("Aplikacja stworzona do celów informacyjnych.")