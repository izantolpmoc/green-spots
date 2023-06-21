/// API CONFIG DEEPL
const apiDeeplKey = process.env.DEEPL_APIKEY as string;
const apiDeeplUrl = process.env.DEEPL_APIURL as string;
/// API CONFIG SIGHTENGINE
const apiSightEngineKey = process.env.SIGHTENGINE_APIKEY as string;
const apiSightEngineUrl = process.env.SIGHTENGINE_APIURL as string;
const apiSightEngineSecret = process.env.SIGHTENGINE_APISECRET as string;


/**
 * Make sure the text doesn't contain links, personal data or profanity
 * @async
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const validateText = async (text: string): Promise<boolean> => {

    /// we translate the text in first
    const wordingInEnglish = await translateText(text);

    const params = new URLSearchParams();

    params.append('text', wordingInEnglish);
    params.append('lang', 'en');
    params.append('opt_countries', 'us,gb,fr');
    params.append('mode', 'standard');
    params.append('api_user', apiSightEngineKey);
    params.append('api_secret', apiSightEngineSecret);

    try {
        const response = await fetch(`${apiSightEngineUrl}?${params.toString()}`, {
            method: 'POST',
        });
      
        const data: any = await response.json();

        const hasNoLink = data.link.matches.length === 0;
        const hasNoPersonal = data.personal.matches.length === 0;
        const hasNoProfanity = data.profanity.matches.length === 0;

        if (hasNoLink && hasNoPersonal && hasNoProfanity) return true;
    } catch (error) {
        console.log(error);
    }

    return false;
}

/**
 * Use DeepL to translate from FR to EN
 * @async
 * @param {string} text
 * @returns {Promise<string>}
 */
const translateText = async (text: string): Promise<string> => {
    const sourceLang = 'FR';
    const targetLang = 'EN';
  
    const params = new URLSearchParams();

    params.append('auth_key', apiDeeplKey);
    params.append('text', text);
    params.append('source_lang', sourceLang);
    params.append('target_lang', targetLang);
  
    try {
        const response = await fetch(`${apiDeeplUrl}?${params.toString()}`, {
            method: 'POST',
        });

        const data = await response.json();
        const translatedText = data.translations[0].text;
        
        return translatedText;
    } catch (error) {
       console.log(error)
    }

    return '';
}


