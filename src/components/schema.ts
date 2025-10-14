const message = '<div><strong>1. </strong>Необходимо внести данные о всех передвижениях за последний день и обязательно учитывать' +
'передвижения в пешей доступности (например: 1 - из дома на работу, 2 - с работы в магазин, 3 - из магазина домой, 4 снова из дома' +
'в детский сад и т.д.)<br><strong>2. </strong>В каждом передвижении важно выбирать адрес отправления и прибытия из списка, который' +
'выпадает в качестве подсказки при вводе адреса (для корректного определения координат местоположения)<br><strong>3. </strong>В поле' +
'\&#34;Комментарии\&#34; рекомендуется внести пожелания по улучшению транспортной инфраструктуре<br><strong>4. </strong>Важно заполнять' +
'данные о передвижениях за конкретный день (вчерашний, последний будний или вечером сегодняшнего дня после полного возвращения домой),' +
'а не усредненные \&#34;обычные\&#34; данные.</div>';


export const schema = {
    h1: {
        type: 'static',
        tag: 'h1',
        content: 'Важно',
    },
    p: {
        type: 'static',
        tag: 'p',
        content: message,
    },
    divider: {
        type: 'static',
        tag: 'hr',
    },
    container_1: {
        type: 'group',
        schema: {
        number: {
            type: 'text',
            inputType: 'number',
            rules: [
                'required',
                'min:7',
                'max:80',
                'integer',
            ],
            autocomplete: 'off',
            label: 'Возраст',
            placeholder: '18',
            forceNumbers: true,
            columns: {
            container: 6,
            },
        },
        select: {
            type: 'select',
            items: [
            {
                value: 'FEMALE',
                label: 'Жен',
            },
            {
                value: 'MALE',
                label: 'Муж',
            },
            ],
            native: false,
            columns: {
            container: 6,
            },
            label: 'Пол',
            rules: [
            'required',
            ],
        },
        },
    },
    container_2: {
        type: 'group',
        schema: {
        select_1: {
            type: 'select',
            native: false,
            label: 'Социальное положение',
            caret: false,
            items: [
            {
                value: 'RETIRED',
                label: 'Пенсионер',
            },
            {
                value: 'STUDENT',
                label: 'Студент',
            },
            {
                value: 'PUPIL',
                label: 'Школьник',
            },
            {
                value: 'WORKER',
                label: 'Работающий',
            },
            ],
            rules: [
            'required',
            ],
            columns: {
            container: 6,
            },
        },
        select_2: {
            type: 'select',
            items: [
            {
                value: 'LESS1000',
                label: 'Менее 1000',
            },
            {
                value: '10002000',
                label: '1000-2000',
            },
            {
                value: '20003000',
                label: '2000-3000',
            },
            ],
            native: false,
            label: 'Затраты на транспорт',
            caret: false,
            rules: [
            'required',
            ],
            columns: {
            container: 6,
            },
        },
        },
    },
    text: {
        type: 'text',
        label: 'Адрес',
        rules: [
        'required',
        ],
    },
    date: {
        type: 'date',
        label: 'Дата передвижений',
        rules: [
        'required',
        ],
    },
    register: {
        type: 'button',
        submits: true,
        full: true,
        size: 'lg',
        buttonLabel: 'Отправить',
    },
}
