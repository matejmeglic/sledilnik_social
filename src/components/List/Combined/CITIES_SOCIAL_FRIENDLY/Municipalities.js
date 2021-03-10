import React, { useMemo } from 'react';
import _ from 'lodash';
import MunicipalitiesDict from '../../../../dict/MunicipalitiesDict';
import { formatNumberWithSign } from './../../../../utils/formatNumber';

// platform friendly icons
const FB_ICONS = {
  down: '⤵',
  up: '⤴',
  no: '',
  between: '➖',
  dots: '...',
};

const TW_ICONS = {
  down: '📉 ',
  up: '📈 ',
  no: '',
  between: '➖ ',
  dots: '... ',
};

const ICONS = {
  FB: FB_ICONS,
  TW: TW_ICONS,
};

const setPlatformFriendlyIcon = (
  iconsVersion = 'FB',
  trend,
  weekly = false
) => {
  const selectedIcons = ICONS[iconsVersion];
  const getTrendIconKey = trend => {
    if (trend < -0.03) {
      return 'down';
    }
    if (trend > 0.03) {
      return 'up';
    }
    if (trend === 'no') {
      return 'no';
    }
    if (trend >= -0.03 || trend <= 0.03) {
      return 'between';
    }
    return 'dots';
  };

  const getWeeklyGrowthIconKey = trend => {
    if (trend < 0) {
      return 'down';
    }
    if (trend === 0) {
      return 'between';
    }
    if (trend > 0) {
      return 'up';
    }
    if (trend === 'no') {
      return 'no';
    }
    return 'dots';
  };

  const iconKey = weekly
    ? getWeeklyGrowthIconKey(trend)
    : getTrendIconKey(trend);

  return selectedIcons[iconKey];
};

const getIconOrTrend = (icons, trend, showTrend, showIcon = false, weekly) =>
  showTrend === 'y' ? (
    showIcon ? (
      setPlatformFriendlyIcon(icons, trend, weekly)
    ) : (
      ''
    )
  ) : (
    <i>
      {trend !== 'no' && Math.round((trend + Number.EPSILON) * 100000) / 100000}
    </i>
  );

const Municipalities = ({
  data = new Map(),
  showTrend = 'y',
  icons = '',
  showIcons,
  weekly,
}) => {
  const memoDisplay = useMemo(() => {
    const display = [];
    for (const [count, townsByDiff] of data) {
      const sameDiffTownsLabel = townsByDiff.map(town => {
        const icon = getIconOrTrend(
          icons,
          town.trend,
          showTrend,
          showIcons,
          weekly
        );
        return (
          <span key={town.key}>
            {town.name} {icon}
            {town.next ? (
              ', '
            ) : (
              <span className="bold"> {formatNumberWithSign(count)}</span>
            )}
          </span>
        );
      });
      display.push(<li key={`${count}-${{ icons }}`}>{sameDiffTownsLabel}</li>);
    }

    return display;
  }, [data, icons, showTrend, showIcons, weekly]);
  return memoDisplay;
};

// { name: x, translation: X} becomes { x: { name: x, translation: X }}
const MunicipalitiesLookup = _.keyBy(MunicipalitiesDict, 'name');

const calc_regions = regions => {
  const region_names = Object.keys(regions);
  const result = region_names.reduce((region_box, region) => {
    const towns = Object.keys(regions[region]);
    const region_numbers_today = towns.reduce((town_box, town) => {
      if (
        MunicipalitiesLookup[town] &&
        MunicipalitiesLookup[town].translation
      ) {
        town_box[MunicipalitiesLookup[town].translation] =
          regions[region][town].confirmedToDate;
      }
      return town_box;
    }, {});
    return { ...region_numbers_today, ...region_box };
  }, {});

  return result;
};

const createCalculatedRegions = perDayRegions => {
  let index = 1;
  const obj = perDayRegions.reduce((acc, regions) => {
    acc['d' + index] = calc_regions(regions);
    index++;
    return acc;
  }, {});
  return obj;
};

function withMunicipalitiesHOC(Component) {
  return ({ ...props }) => {
    const perDayRegions = props.data
      .map(item => item.regions)
      .reverse()
      .slice(0, 16);
    // ? we could skip calculatedPerDayRegions and calc regions even earlier
    const calculatedPerDayRegions = createCalculatedRegions([...perDayRegions]);

    const difference_since_yesterday = _.assignWith(
      { ...calculatedPerDayRegions.d1 },
      { ...calculatedPerDayRegions.d2 },
      (today, yesterday) => today - yesterday
    );

    const townsByDifference = _.toPairs(difference_since_yesterday) // { ljubljana: 10, maribor: 8 } becomes [['ljubljana', 10], ['maribor', 8]]
      .sort((a, b) => b[1] - a[1])
      .reverse()
      .reduce((acc, [town, count]) => {
        if (count < 1) {
          return acc;
        }
        if (acc[count]) {
          acc[count].push(town);
        } else {
          acc[count] = [town];
        }
        return acc;
      }, {});

    const getTrend = deltas => {
      // prepare params to calculate trend
      const addValue = (acc, value) => acc + value;
      const y3 = deltas.slice(0, 7).reduce(addValue, 0);
      const y2 = deltas.slice(4, 11).reduce(addValue, 0);
      const y1 = deltas.slice(8, 15).reduce(addValue, 0);

      // calculate trend
      const oneTrendArgIsUndefined = y1 === 0 || y2 === 0 || y3 === 0;
      const calcTrend = (y1, y2, y3) =>
        (Math.log(y1) + 3 * Math.log(y3) - 4 * Math.log(y2)) / 8;
      const trend = oneTrendArgIsUndefined ? 'no' : calcTrend(y1, y2, y3);
      return trend;
    };

    const getDeltas = (town, calculatedPerDayRegions) =>
      Object.entries(calculatedPerDayRegions).map(
        ([day, regionData], index, days) => {
          if (day === 'd16') {
            return null; // last value; can not subtract
          }
          const regionDataDayBefore = days[index + 1][1];
          return regionData[town] - regionDataDayBefore[town];
        }
      );

    const getTownTrend = calculatedPerDayRegions => town => {
      // prepare data to calculate trend
      const deltas = getDeltas(town, calculatedPerDayRegions).filter(
        item => item !== null
      );
      const trend = getTrend(deltas);
      return [town, trend];
    };

    const getWeeklyGrowth = (town, calculatedPerDayRegions) => {
      const townConfirmedToDate = Object.entries(
        calculatedPerDayRegions
      ).reduce((acc, [day, regionData]) => {
        if (day === 'd16') {
          return acc; // last value; can not subtract
        }

        acc.push(regionData[town]);
        return acc;
      }, []);

      const casesNow = townConfirmedToDate[0];
      const cases7dAgo = townConfirmedToDate[7];
      const cases14dAgo = townConfirmedToDate[14];

      const incidenceThisWeek = casesNow - cases7dAgo;
      const incidenceLastWeek = cases7dAgo - cases14dAgo;
      const weeklyGrowth = incidenceThisWeek / incidenceLastWeek - 1;

      return [town, weeklyGrowth];
    };

    const getTownWeeklyGrowth = calculatedPerDayRegions => town => {
      const weeklyGrowth = getWeeklyGrowth(
        town,
        calculatedPerDayRegions
      ).filter(item => item !== null);
      return weeklyGrowth;
    };

    const calcData = props.weekly ? getTownWeeklyGrowth : getTownTrend;

    const data = Object.entries(townsByDifference)
      .reverse()
      .reduce((acc1, [count, towns]) => {
        const townsLabelData = towns
          .map(calcData(calculatedPerDayRegions))
          .reduce((acc, townWithTrend, index) => {
            // townWithTrend = ["Murska Sobota",  -0.031660708691416684];
            const townLabel = {
              key: `${count}-${townWithTrend[0]}`,
              name: townWithTrend[0],
              trend: townWithTrend[1],
              next: index !== towns.length - 1,
            };
            acc.push(townLabel);
            return acc;
          }, []);
        acc1.set(count, townsLabelData);
        return acc1;
      }, new Map());

    const newProps = {
      data,
      showTrend: props.showTrend,
      icons: props.icons,
      showIcons: props.showIcons,
      weekly: props.weekly,
    };

    return <Component {...newProps} />;
  };
}

export default withMunicipalitiesHOC(Municipalities);
