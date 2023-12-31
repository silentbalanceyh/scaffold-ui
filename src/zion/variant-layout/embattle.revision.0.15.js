const layout = {
    1009: "16,8",    // ---- --
    1014: "10,14",   // ---- ---- ----
    2014: "10,14",   // ---- ---- ----
    2110: "6,18",    //                ---- ---- ----
    2105: "9,15",    //                     ---- ----
    1019: "7,17,99",
    3009: "16,8",
    3105: "8,16",
    3205: "8,16",
    3010: "14,10",
    3107: "10,14",    //           ---- ----
    3207: "8,16",   //                     ---- ----
    3210: "4,20",
    3110: "4,20",
    3014: "10,14",
    2018: "8,16",
    2106: "6,18",
    2010: "14,10",

    4009: "16,8",    // ---- --
    4105: "8,16",   //        -- ----
    4205: "8,16",   //                ---- --
    4305: "8,16",   //                       -- ----
    3011: "13,11",   // ---- ----

    3012: "12,12",   // ---- ---- ----
    3106: "10,14",   //                ---- --
    3206: "10,14",   //                       -- ----
    1024: "6,18",    // ---- ---- ---- ---- ---- ----
    2011: "13,11",   // ---- ----
    2113: "4,20,95", //           ---- ---- ---- ----
    2013: "11,13,95",// ---- ----
    2114: "5,19",
    2111: "4,20,95", //           ---- ---- ---- ----
    2009: "16,8",    // ---- ----
    2115: "3,21",    //           ---- ---- ---- ----
    2019: "8,16,95", // ---- ---- ---- ----
};
const adjust = {
    1014: "1%",
    1019: "3%",
    3010: "1%",
    3014: "1%",
    2118: "2%",      //        -- ---- ---- ---- ----
    2016: "2%",      // ---- ---- ---- ----
    2014: "1%",      // ---- ---- ----
    // 2115: "1%",      //           ---- ---- ---- ----
    2113: "3%",      //           ---- ---- ---- ----
    2013: "2%",      // ---- ----
    2010: "1%"
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    layout,
    adjust,
    row: {
        1: [24],
        2: [14, 10],
        3: [10, 7, 7],
        4: [9, 5, 5, 5]
    }
};