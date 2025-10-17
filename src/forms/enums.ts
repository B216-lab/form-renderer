export enum Gender {
  MALE = "мужской",
  FEMALE = "женский",
}

export enum TypeMovement {
  ON_FOOT = "пешком",
  TRANSPORT = "транспорт",
}

export enum SocialStatus {
  WORKING = "работающий",
  STUDENT = "школьник",
  UNIVERSITY_STUDENT = "студент",
  PENSIONER = "пенсионер по возрасту",
  PERSON_WITH_DISABILITIES = "человек c ограниченными возможностями",
  UNEMPLOYED = "безработный",
  HOUSEWIFE = "домохозяйка",
  TEMPORARILY_UNEMPLOYED = "временно нетрудящийся (декретный отпуск, отпуск по уходу за ребенком)",
}

export enum FinancialSituation {
  UP_TO_10_THOUSAND = "до 10 тысяч рублей",
  FROM_10_TO_25_THOUSAND = "от 10 до 25 тысяч рублей",
  FROM_25_TO_35_THOUSAND = "от 25 до 35 тысяч рублей",
  FROM_35_TO_45_THOUSAND = "от 35 до 45 тысяч рублей",
  FROM_45_TO_65_THOUSAND = "от 45 до 65 тысяч рублей",
  FROM_65_TO_90_THOUSAND = "от 65 до 90 тысяч рублей",
  FROM_90_TO_120_THOUSAND = "от 90 до 120 тысяч рублей",
  ABOVE_120_THOUSAND = "от 120 тысяч рублей и выше",
  NO_INCOME = "нет заработка",
}

export enum TransportationCosts {
  LESS_THAN_1000 = "менее 1000",
  FROM_1000_TO_2000 = "1000-2000",
  FROM_2000_TO_3000 = "2000-3000",
  FROM_3000_TO_5000 = "3000-5000",
  FROM_5000_TO_7000 = "5000-7000",
  FROM_7000_TO_10000 = "7000-10 000",
  ABOVE_10000 = "более 10 000",
  NO_EXPENSES = "ничего не трачу",
}

export enum Place {
  HOME_RESIDENCE = "дом - место жительства",
  FRIENDS_RELATIVES_HOME = "дом друзей / родственников",
  WORKPLACE = "работа / рабочее место",
  WORK_BUSINESS_TRIP = "работа - служебная поездка",
  DAYCARE_CENTER = "детский сад",
  SCHOOL = "школа",
  COLLEGE_TECHNICAL_SCHOOL = "колледж / техникум / училище",
  UNIVERSITY_INSTITUTE = "университет / институт",
  HOSPITAL_CLINIC = "больница / поликлиника",
  CULTURAL_INSTITUTION = "учреждение культуры (музей, театр, цирк, библиотека и т.п.)",
  SPORT_FITNESS = "спорт / фитнес",
  STORE_MARKET = "магазин / рынок",
  SHOPPING_ENTERTAINMENT_CENTER = "торгово - развлекательный центр",
  RESTAURANT_CAFE = "ресторан / кафе / пункт общественного питания",
  SUBURB = "пригород",
  OTHER = "другое",
}

export enum Transport {
  BICYCLE = "велосипед",
  INDIVIDUAL_MOBILITY = "средства индивидуальной мобильности (самокат и пр.)",
  BUS = "автобус",
  SHUTTLE_TAXI = "маршрутное такси",
  TRAM = "трамвай",
  PRIVATE_CAR = "личный автомобиль",
  TROLLEYBUS = "троллейбус",
  SUBURBAN_TRAIN = "электричка",
  METRO = "метро",
  TAXI = "такси",
  CAR_SHARING = "каршеринг",
  CITY_BIKE_RENTAL = "городской велопрокат",
  SERVICE = "служебный транспорт",
}
