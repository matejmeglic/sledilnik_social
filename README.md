# Sledilnik Social

Basic API extraction to serve Sledilnik's API data in a Social media form.

## ver: 0.2.0

Endpoints for data fetch are set in `apiPathObject.js`

### API Paths

- stats
- patients
- municipalities
- hospitals-list
- lab-tests
- summary

### Components

There are 3 main components: `<TESTS_ACTIVE>`, `<HOSPITALIZED_DECEASED>` and `<Combined>`

#### TESTS_ACTIVE

Display 3 sets of data:

1. PCR tests.
2. HAT tests.
3. Active cases.

Tests data includes: positive, performed and percentage.
Active cases: total, increased and decreased.

### HOSPITALIZED_DECEASED

Display 3 sets of data:

1. How many persons need hospital treatment.
2. How many person are on repirators.
3. Number of deceased.

### Combined

1. Data in TESTS_ACTIVE.
2. Vaccination.
3. Confirmed.
4. Segments per age.
5. data in HOSPITALIZED_DECEASED
6. Number of patients in hospitals by hospital.
7. Data by municipalities with social friendly icons (Facebook, Twitter) for each social platform.

## ver: 0.1.0

- APIs are set in App.js
- ./components/List.js - parse data
  - if you want to disable "Moralec" comment out RandomGenerator start and end
  - there are subcomponents for Delta and Percentage
- municipalities have a complex algorithm, check Array
