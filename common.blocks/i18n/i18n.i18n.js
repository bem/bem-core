export default {
    i18n : {
        i18n : function() {
            let data;

            /**
             * @param {String} keyset
             * @param {String} key
             * @param {Object} [params]
             * @returns {String}
             */
            function i18n(keyset, key, params) {
                if(!data) throw Error('i18n need to be filled with data');
                const val = data[keyset] && data[keyset][key];
                return typeof val === 'undefined'?
                keyset + ':' + key :
                    typeof val === 'string'?
                        val :
                        val.call(i18n, params, i18n);
            }

            i18n.decl = function(i18nData) {
                if(!data) {
                    data = i18nData;
                    return this;
                }

                for(const ks in i18nData) {
                    const dataKs = data[ks] || (data[ks] = {}),
                        i18nDataKs = i18nData[ks];

                    for(const k in i18nDataKs)
                        dataKs[k] = i18nDataKs[k];
                }

                return this;
            };

            return i18n;
        }
    }
};
