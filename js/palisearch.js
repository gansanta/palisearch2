"use strict"
const Datastore = require("nedb")
const path = require("path")
const FS = require("fs")
const ipcrenderer = require('electron').ipcRenderer
const electron = require('electron')


const FILENUM = 3, SENNUM = 100, WORDNUM = 500

const bookidlist = ['mul1v01par','mul1v02pac','mul1v03mah','mul1v04cul','mul1v05par','mul2d01sil','mul2d02mah','mul2d03pat','mul3m01mul','mul3m02maj','mul3m03upa','mul4s01sag','mul4s02nid','mul4s03kha','mul4s04sal','mul4s05mah','mul5a01eka','mul5a02duk','mul5a03tik','mul5a04cat','mul5a05pan','mul5a06cha','mul5a07sat','mul5a08att','mul5a09nav','mul5a10das','mul5a11eka','mul6k01khu','mul6k02dha','mul6k03uda','mul6k04iti','mul6k05sut','mul6k06vim','mul6k07pet','mul6k08the','mul6k09the','mul6k10apa01','mul6k11apa02','mul6k12bud','mul6k13car','mul6k14jat01','mul6k15jat02','mul6k16mah','mul6k17cul','mul6k18pat','mul6k19net','mul6k20mil','mul6k21pet','mul7a01dha','mul7a02vib','mul7a03dha','mul7a04pug','mul7a05kat','mul7a06yam01','mul7a07yam02','mul7a08yam03','mul7a09pat01','mul7a10pat02','mul7a11pat03','mul7a12pat04','mul7a13pat05','att1v01par','att1v02pac','att1v03mah','att1v04cul','att1v05par','att2d01sil','att2d02mah','att2d03pat','att3m01mul','att3m02maj','att3m03upa','att4s01sag','att4s02nid','att4s03kha','att4s04sal','att4s05mah','att5a01eka','att5a02duk','att5a03tik','att5a04cat','att5a05pan','att5a06cha','att5a07sat','att5a08att','att5a09nav','att5a10das','att5a11eka','att6k01khu','att6k02dha','att6k03uda','att6k04iti','att6k05sut','att6k06vim','att6k07pet','att6k08the','att6k09the','att6k10apa','att6k11bud','att6k12car','att6k13jat01','att6k14jat02','att6k15jat03','att6k16jat04','att6k17jat05','att6k18jat06','att6k19jat07','att6k20mah','att6k21cul','att6k22pat','att6k23net','att7a01dha','att7a02vib','att7a03dha','att7a04pug','att7a05kat','att7a06yam','att7a07pat','tik1v01sar01','tik1v02sar02','tik1v03sar03','tik1v04dve','tik1v05kan','tik1v06vsa','tik1v07vaj','tik1v08vim','tik1v09vlt','tik1v10kap','tik1v11vuv','tik1v12vvt','tik1v13pdi','tik1v14kmu','tik2d01sil','tik2d02mah','tik2d03pat','tik2d04sab','tik3m01mul','tik3m02maj','tik3m03upa','tik4s01sag','tik4s02nid','tik4s03kha','tik4s04sal','tik4s05mah','tik5a01eka','tik5a02duk','tik5a03tik','tik5a04cat','tik5a05pan','tik5a06cha','tik5a07sat','tik5a08att','tik5a09nav','tik5a10das','tik5a11eka','tik6k01npt','tik6k02nvn','tik7a01dmt','tik7a02vmt','tik7a03pmt','tik7a04dat','tik7a05pat','tik7a06anp','tik7a07asn','tik7a08apu','tik7a09ama','ann1v01vis01','ann1v02vis02','ann1v03vmt01','ann1v04vmt02','ann1v05vnk','ann2s01dig','ann2s02maj','ann2s03san','ann2s04ang','ann2s05vin','ann2s06abh','ann2s07att','ann3l01nir','ann3l02par','ann3l03anu','ann3l04pat','ann4b01nam','ann4b02mah','ann4b03lak','ann4b04sut','ann4b05kam','ann4b06jin','ann4b07paj','ann4b08bud','ann5b01cul','ann5b02mah','ann5b03sas','ann6v01kac','ann6v02mog','ann6v03sad','ann6v04pad','ann6v05mpn','ann6v06pay','ann6v07vut','ann6v08adp','ann6v09adt','ann6v10sup','ann6v11sut','ann6v12val','ann7n01lok','ann7n02sut','ann7n03sur','ann7n04mah','ann7n05dha','ann7n06kav','ann7n07nit','ann7n08nar','ann7n09cat','ann7n10can','ann8p01ras','ann8p02sim','ann8p03ves','ann9s01mog','ann9s02thu','ann9s03dat','ann9s04dha','ann9s05dht','ann9s06hat','ann9s07jin','ann9s08jvd','ann9s09tel','ann9s10mil','ann9s11pad','ann9s12psd','ann9s13sad','ann9s14kdm','ann9s15sam'];
const bookShortnamelist = ['পারা.','পাচি.','মহা.','চুল.','পরি.','দীঘ.০১.','দীঘ.০২.','দীঘ.০৩.','মজ্ঝি.০১.','মজ্ঝি.০২.','মজ্ঝি.০৩.','সং.০১.','সং.০২.','সং.০৩.','সং.০৪.','সং.০৫.','অঙ্গু.০১.','অঙ্গু.০২.','অঙ্গু.০৩.','অঙ্গু.০৪.','অঙ্গু.০৫.','অঙ্গু.০৬.','অঙ্গু.০৭.','অঙ্গু.০৮.','অঙ্গু.০৯.','অঙ্গু.১০.','অঙ্গু.১১.','খুদ্দ.পাঠ.','ধম্মপদ.','উদা.','ইতি.','সুত্তনি.','ৰিমা.','পেত.','থের.','থেরী.','অপ.০১.','অপ.০২.','বুদ্ধ.','চরিযা.','জাতক.১.','জাতক.২.','মহানি.','চূলনি.','পটিস.','নেত্তি.','মিলিন্দ.','পেটকো.','ধম্মস.','ৰিভঙ্গ.','ধাতু.','পুগ্গল.','কথাৰ.','যমক.০১.','যমক.০২.','যমক.০৩.','পট্ঠান.০১.','পট্ঠান.০২.','পট্ঠান.০৩.','পট্ঠান.০৪.','পট্ঠান.০৫.','পারা.অ.','পাচি.অ.','মহা.অ.','চুল.অ.','পরি.অ.','দীঘ.অ.০১.','দীঘ.অ.০২.','দীঘ.অ.০৩.','মজ্ঝি.অ.০১.','মজ্ঝি.অ.০২.','মজ্ঝি.অ.০৩.','সং.অ.০১.','সং.অ.০২.','সং.অ.০৩.','সং.অ.০৪.','সং.অ.০৫.','অঙ্গু.অ.০১.','অঙ্গু.অ.০২.','অঙ্গু.অ.০৩.','অঙ্গু.অ.০৪.','অঙ্গু.অ.০৫.','অঙ্গু.অ.০৬.','অঙ্গু.অ.০৭.','অঙ্গু.অ.০৮.','অঙ্গু.অ.০৯.','অঙ্গু.অ.১০.','অঙ্গু.অ.১১.','খুদ্দ.পাঠ.অ.','ধম্মপদ.অ.','উদা.অ.','ইতি.অ.','সুত্তনি.অ.','ৰিমা.অ.','পেত.অ.','থের.অ.','থেরী.অ.','অপ.অ.','বুদ্ধ.অ.','চরিযা.অ.','জাতক.অ.০১.','জাতক.অ.০২.','জাতক.অ.০৩.','জাতক.অ.০৪.','জাতক.অ.০৫.','জাতক.অ.০৬.','জাতক.অ.০৭.','মহানি.অ.','চূলনি.অ.','পটিস.অ.','নেত্তি.অ.','ধম্মস.অ.','ৰিভঙ্গ.অ.','ধাতু.অ.','পুগ্গল.অ.','কথাৰ.অ.','যমক.অ.','পট্ঠান.অ.','সার.টী.০১.','সার.টী.০২.','সার.টী.০৩.','দ্বেমা.','কঙ্খা.ৰি.অ.','ৰিন.স.অ.','ৰজি.টী.','ৰিম.টী.','বিন.ল.টী.','কঙ্খা.পু.টী.','ৰিন.উত্ত.','ৰিন.ৰি.টী.','পাচিত্যা.','খুদ্দ.মূ.','দীঘ.টী.০১.','দীঘ.টী.০২.','দীঘ.টী.০৩.','সীল.অভি.টী.','মজ্ঝি.টী.০১.','মজ্ঝি.টী.০২.','মজ্ঝি.টী.০৩.','সং.টী.০১.','সং.টী.০২.','সং.টী.০৩.','সং.টী.০৪.','সং.টী..০৫.','অঙ্গু.টী.০১.','অঙ্গু.টী.০২.','অঙ্গু.টী.০৩.','অঙ্গু.টী.০৪.','অঙ্গু.টী.০৫.','অঙ্গু.টী.০৬.','অঙ্গু.টী.০৭.','অঙ্গু.টী.০৮.','অঙ্গু.টী.০৯.','অঙ্গু.টী.১০.','অঙ্গু.টী.১১.','নেত্তি.টী.','নেত্তি.ৰি.','ধম্মস.মূ.টী.','ৰিভ.মূ.টী.','পঞ্চপ.মূ.টী.','ধম্মস.অনুটী.','পঞ্চপ.অনুটী.','অভিধ.নাম.','অভিধ.স.','অভিধ.পু.','অভিধ.মা.','ৰিসু.১.','ৰিসু.২.','ৰিসু.মহা.১.','ৰিসু.মহা.২.','ৰিসু.নিদা.','দীঘ.পুবি.','মজ্ঝি.পুবি.','সং.পুবি.','অঙ্গু.পুবি.','ৰিন.পুবি.','অভি.পুবি.','অট্ঠ.পুবি.','নিরু.দী.','পরম.দী.','অনু.দী.','পট্ঠা.দী.','নম.টী.','মহাপ.পা.','লক্খ.বু.','সুত্ত.ৰ.','কমল.','জিনা.','পজ্জ.','বুদ্ধ.গা.','চূল.গ.','মহাৰং.','সাস.ৰং.','কচ্চা.ব্যা.','মোগ্গ.ব্যা.','সদ্দ.প.','পদ.সি.','মোগ্গ.প.','পযো.সি.','ৰুত্তো.','অভিধা.দী.','অভিধা.দী.টী.','সুবো.','সুৰো.টী.','বালা.','লোক.','সুত্ত.','সূরস্স.','মহার.','ধম্মনী.','কৰিদ.','নীতিম.','নর.দী.','চতু.দী.','চাণক্য.','রস.','সীম.','ৰেস্স.','মোগ্গ.ৰি.','থূপ.','দাঠা.','ধাতুপা.','ধাতুৰ.','হত্থৰ.','জিনচ.','জিনৰ.','তেলক.','মিলিদ.','পদম.','পদসা.','সদ্দৰি.','কচ্চা.ধা.','সামন্ত.'];
const booktitlelist = [
  'পারাজিকপাল়ি','পাচিত্তিযপাল়ি','মহাৰগ্গপাল়ি','চূল়ৰগ্গপাল়ি','পরিৰারপাল়ি',
  'সীলক্খন্ধৰগ্গপাল়ি','মহাৰগ্গপাল়ি','পাথিকৰগ্গপাল়ি',
  'মূলপণ্ণাসপাল়ি','মজ্ঝিমপণ্ণাসপাল়ি','উপরিপণ্ণাসপাল়ি',
  'সগাথাৰগ্গপাল়ি','নিদানৰগ্গপাল়ি','খন্ধৰগ্গপাল়ি','সল়াযতনৰগ্গপাল়ি','মহাৰগ্গপাল়ি',
  'এককনিপাতপাল়ি','দুকনিপাতপাল়ি','তিকনিপাতপাল়ি','চতুক্কনিপাতপাল়ি','পঞ্চকনিপাতপাল়ি','ছক্কনিপাতপাল়ি','সত্তকনিপাতপাল়ি','অট্ঠকাদিনিপাতপাল়ি','নৰকনিপাতপাল়ি','দসকনিপাতপাল়ি','একাদসকনিপাতপাল়ি',
  'খুদ্দকপাঠপাল়ি','ধম্মপদপাল়ি','উদানপাল়ি','ইতিৰুত্তকপাল়ি','সুত্তনিপাতপাল়ি','ৰিমানৰত্থুপাল়ি','পেতৰত্থুপাল়ি','থেরগাথাপাল়ি','থেরীগাথাপাল়ি','অপদানপাল়ি-১','অপদানপাল়ি-২','বুদ্ধৰংসপাল়ি','চরিযাপিটকপাল়ি','জাতকপাল়ি-১','জাতকপাল়ি-২','মহানিদ্দেসপাল়ি','চূল়নিদ্দেসপাল়ি','পটিসম্ভিদামগ্গপাল়ি','নেত্তিপ্পকরণপাল়ি','মিলিন্দপঞ্হপাল়ি','পেটকোপদেসপাল়ি',
  'ধম্মসঙ্গণীপাল়ি','ৰিভঙ্গপাল়ি','ধাতুকথাপাল়ি','পুগ্গলপঞ্ঞত্তিপাল়ি','কথাৰত্থুপাল়ি','যমকপাল়ি-১','যমকপাল়ি-২','যমকপাল়ি-৩','পট্ঠানপাল়ি-১','পট্ঠানপাল়ি-২','পট্ঠানপাল়ি-৩','পট্ঠানপাল়ি-৪','পট্ঠানপাল়ি-৫',
  
  'পারাজিককণ্ড-অট্ঠকথা','পাচিত্তিয-অট্ঠকথা','মহাৰগ্গ-অট্ঠকথা','চূল়ৰগ্গ-অট্ঠকথা','পরিৰার-অট্ঠকথা',
  
  'সীলক্খন্ধৰগ্গ-অট্ঠকথা','মহাৰগ্গ-অট্ঠকথা','পাথিকৰগ্গ-অট্ঠকথা',
  'মূলপণ্ণাস-অট্ঠকথা','মজ্ঝিমপণ্ণাস-অট্ঠকথা','উপরিপণ্ণাস-অট্ঠকথা',
  'সগাথাৰগ্গ-অট্ঠকথা','নিদানৰগ্গ-অট্ঠকথা','খন্ধৰগ্গ-অট্ঠকথা','সল়াযতনৰগ্গ-অট্ঠকথা','মহাৰগ্গ-অট্ঠকথা',
  'এককনিপাত-অট্ঠকথা','দুকনিপাত-অট্ঠকথা','তিকনিপাত-অট্ঠকথা','চতুক্কনিপাত-অট্ঠকথা','পঞ্চকনিপাত-অট্ঠকথা','ছক্কনিপাত-অট্ঠকথা','সত্তকনিপাত-অট্ঠকথা','অট্ঠকনিপাত-অট্ঠকথা','নৰকনিপাত-অট্ঠকথা','দসকনিপাত-অট্ঠকথা','একাদসকনিপাত-অট্ঠকথা',
  'খুদ্দকপাঠ-অট্ঠকথা','ধম্মপদ-অট্ঠকথা','উদান-অট্ঠকথা','ইতিৰুত্তক-অট্ঠকথা','সুত্তনিপাত-অট্ঠকথা','ৰিমানৰত্থু-অট্ঠকথা','পেতৰত্থু-অট্ঠকথা','থেরগাথা-অট্ঠকথা','থেরীগাথা-অট্ঠকথা','অপদান-অট্ঠকথা','বুদ্ধৰংস-অট্ঠকথা','চরিযাপিটক-অট্ঠকথা','জাতক-অট্ঠকথা-১','জাতক-অট্ঠকথা-২','জাতক-অট্ঠকথা-৩','জাতক-অট্ঠকথা-৪','জাতক-অট্ঠকথা-৫','জাতক-অট্ঠকথা-৬','জাতক-অট্ঠকথা-৭','মহানিদ্দেস-অট্ঠকথা','চূল়নিদ্দেস-অট্ঠকথা','পটিসম্ভিদামগ্গ-অট্ঠকথা','নেত্তিপ্পকরণ-অট্ঠকথা',
  'ধম্মসঙ্গণি-অট্ঠকথা','সম্মোহৰিনোদনী-অট্ঠকথা','ধাতুকথা-অট্ঠকথা','পুগ্গলপঞ্ঞত্তি-অট্ঠকথা','কথাৰত্থু-অট্ঠকথা','যমকপ্পকরণ-অট্ঠকথা','পট্ঠানপ্পকরণ-অট্ঠকথা',
  
  'সারত্থদীপনী-টীকা-১','সারত্থদীপনী-টীকা-২','সারত্থদীপনী-টীকা-৩','দ্বেমাতিকাপাল়ি','কঙ্খাৰিতরণী-অট্ঠকথা','ৰিনযসঙ্গহ-অট্ঠকথা','ৰজিরবুদ্ধি-টীকা','ৰিমতিৰিনোদনী-টীকা','ৰিনযালঙ্কার-টীকা','কঙ্খাৰিতরণীপুরাণ-টীকা','ৰিনযৰিনিচ্ছয-উত্তরৰিনিচ্ছয','ৰিনযৰিনিচ্ছয-টীকা','পাচিত্যাদিযোজনাপাল়ি','খুদ্দসিক্খা-মূলসিক্খা',
  
  'সীলক্খন্ধৰগ্গ-টীকা','মহাৰগ্গ-টীকা','পাথিকৰগ্গ-টীকা','সীলক্খন্ধৰগ্গ-অভিনৰটীকা',
  'মূলপণ্ণাস-টীকা','মজ্ঝিমপণ্ণাস-টীকা','উপরিপণ্ণাস-টীকা',
  'সগাথাৰগ্গ-টীকা','নিদানৰগ্গ-টীকা','খন্ধৰগ্গ-টীকা','সল়াযতনৰগ্গ-টীকা','মহাৰগ্গ-টীকা',
  'এককনিপাত-টীকা','দুকনিপাত-টীকা','তিকনিপাত-টীকা','চতুক্কনিপাত-টীকা','পঞ্চকনিপাত-টীকা','ছক্কনিপাত-টীকা','সত্তকনিপাত-টীকা','অট্ঠকনিপাত-টীকা','নৰকনিপাত-টীকা','দসককনিপাত-টীকা','একাদসকনিপাত-টীকা',
  'নেত্তিপ্পকরণ-টীকা','নেত্তিৰিভাৰিনী',
  'ধম্মসঙ্গণি-মূলটীকা','ৰিভঙ্গ-মূলটীকা','পঞ্চপকরণ-মূলটীকা','ধম্মসঙ্গণী-অনুটীকা','পঞ্চপকরণ-অনুটীকা','অভিধম্মাৰতারো-নামরূপপরিচ্ছেদো','অভিধম্মত্থসঙ্গহো','অভিধম্মাৰতার-পুরাণটীকা','অভিধম্মমাতিকাপাল়ি',
  'ৰিসুদ্ধিমগ্গ-১','ৰিসুদ্ধিমগ্গ-২','ৰিসুদ্ধিমগ্গ-মহাটীকা-১','ৰিসুদ্ধিমগ্গ-মহাটীকা-২','ৰিসুদ্ধিমগ্গ নিদানকথা',
  'দীঘনিকায (পু-ৰি)','মজ্ঝিমনিকায (পু-ৰি)','সংযুত্তনিকায (পু-ৰি)','অঙ্গুত্তরনিকায (পু-ৰি)','ৰিনযপিটক (পু-ৰি)','অভিধম্মপিটক (পু-ৰি)','অট্ঠকথা (পু-ৰি)',
  'নিরুত্তিদীপনী','পরমত্থদীপনী সঙ্গহমহাটীকাপাঠ','অনুদীপনীপাঠ','পট্ঠানুদ্দেস দীপনীপাঠ',
  'নমক্কারটীকা','মহাপণামপাঠ','লক্খণাতো বুদ্ধথোমনাগাথা','সুতৰন্দনা','কমলাঞ্জলি','জিনালঙ্কার','পজ্জমধু','বুদ্ধগুণগাথাৰলী',
  'চূল়গন্থৰংস','মহাৰংস','সাসনৰংস',
  'কচ্চাযনব্যাকরণং','মোগ্গল্লানব্যাকরণং','সদ্দনীতিপ্পকরণং (পদমালা)','পদরূপসিদ্ধি','মোগল্লানপঞ্চিকা','পযোগসিদ্ধিপাঠ','ৰুত্তোদযপাঠ','অভিধানপ্পদীপিকাপাঠ','অভিধানপ্পদীপিকাটীকা','সুবোধালঙ্কারপাঠ','সুবোধালঙ্কারটীকা','বালাৰতার গণ্ঠিপদত্থৰিনিচ্ছযসার',
  'লোকনীতি','সুত্তন্তনীতি','সূরস্সতিনীতি','মহারহনীতি','ধম্মনীতি','কৰিদপ্পণনীতি','নীতিমঞ্জরী','নরদক্খদীপনী','চতুরারক্খদীপনী','চাণক্যনীতি',
  'রসৰাহিনী','সীমৰিসোধনীপাঠ','ৰেস্সন্তরগীতি',
  'মোগ্গল্লান ৰুত্তিৰিৰরণপঞ্চিকা','থূপৰংস','দাঠাৰংস','ধাতুপাঠৰিলাসিনিযা','ধাতুৰংস','হত্থৰনগল্লৰিহারৰংস','জিনচরিতয','জিনৰংসদীপং','তেলকটাহগাথা','মিলিদটীকা','পদমঞ্জরী','পদসাধনং','সদ্দবিন্দুপকরণং','কচ্চাযনধাতুমঞ্জুসা','সামন্তকূটৰণ্ণনা'
]

const bnromanall = [
    {bn:"অ", en: "a", type:"vowel"},
    {bn:"আ", en: "ā", type:"vowel"},
    {bn:"ই", en: "i", type:"vowel"},
    {bn:"ঈ", en: "ī", type:"vowel"},
    {bn:"উ", en: "u", type:"vowel"},
    {bn:"ঊ", en: "ū", type:"vowel"},
    {bn:"এ", en: "e", type:"vowel"},
    {bn:"ও", en: "o", type:"vowel"},

    {bn:"ক", en: "k", type:"consonant"},
    {bn:"খ", en: "kh", type:"consonant"},
    {bn:"গ", en: "g", type:"consonant"},
    {bn:"ঘ", en: "gh", type:"consonant"},
    {bn:"ঙ", en: "ṅ", type:"consonant"},
    {bn:"চ", en: "c", type:"consonant"},
    {bn:"ছ", en: "ch", type:"consonant"},
    {bn:"জ", en: "j", type:"consonant"},
    {bn:"ঝ", en: "jh", type:"consonant"},
    {bn:"ঞ", en: "ñ", type:"consonant"},
    {bn:"ট", en: "ṭ", type:"consonant"},
    {bn:"ঠ", en: "ṭh", type:"consonant"},
    {bn:"ড", en: "ḍ", type:"consonant"},
    {bn:"ঢ", en: "ḍh", type:"consonant"},
    {bn:"ণ", en: "ṇ", type:"consonant"},
    {bn:"ত", en: "t", type:"consonant"},
    {bn:"থ", en: "th", type:"consonant"},
    {bn:"দ", en: "d", type:"consonant"},
    {bn:"ধ", en: "dh", type:"consonant"},
    {bn:"ন", en: "n", type:"consonant"},
    {bn:"প", en: "p", type:"consonant"},
    {bn:"ফ", en: "ph", type:"consonant"},
    {bn:"ব", en: "b", type:"consonant"},
    {bn:"ভ", en: "bh", type:"consonant"},
    {bn:"ম", en: "m", type:"consonant"},
    {bn:"য", en: "y", type:"consonant"},
    {bn:"র", en: "r", type:"consonant"},
    {bn:"ল", en: "l", type:"consonant"},
    {bn:"ৰ", en: "v", type:"consonant"},
    {bn:"শ", en: "s", type:"consonant"},
    {bn:"ষ", en: "s", type:"consonant"},    
    {bn:"স", en: "s", type:"consonant"},
    {bn:"হ", en: "h", type:"consonant"},
    {bn:"ল়", en: "ḷ", type:"consonant"},
    {bn:"ং", en: "ṃ", type:"consonant"},
    {bn:"ং", en: "ṁ", type:"consonant"}, //ŋ ṁ
    {bn:"ং", en: "ŋ", type:"consonant"},

    {bn:"া", en: "ā", type:"vsign"},
    {bn:"ি", en: "i", type:"vsign"},
    {bn:"ী", en: "ī", type:"vsign"},
    {bn:"ু", en: "u", type:"vsign"},
    {bn:"ূ", en: "ū", type:"vsign"},
    {bn:"ে", en: "e", type:"vsign"},
    {bn:"ো", en: "o", type:"vsign"}
]

let ghosachars = ["k","g","c","j","ṭ","ḍ","t","d","p","b"]
//to store dbpath and db later
let previous = {
    dbpath: null,
    db: null
}
let dbs = {}

let pagewordsDocs = [] //preload it
let isResultSaved = false //flag for saving result

let allpagesfolderpath = path.join(__dirname,"db2","pages")
let pagewordsdbpath = "./db2/pagewords.db" // page => wordlist
let searchhistorydbpath2 = "./db2/searchhistory2.db"

let shistoryfolder = "./db2/shistoryfiles"
let shistorylistdbpath = "./db2/shistorylist.db"

window.onload = async ()=>{
  attachListners()
  //await separateWorddb()
  //dotest()
  //task()
  //dbtest()
}



let bnsentence = ""

//---------------
async function separateWorddb(){
  await loadPagewordsDatabase()

  let muls = pagewordsDocs.filter(doc=> doc.filename.startsWith("ann"))
  muls = muls.sort((a,b)=>a.filename.localeCompare(b.filename, "en"))
  
  //delete id
  for(let m of muls){ delete m._id}

  let newdbpath = "./db2/annwords.db"
  let newdb = getDB(newdbpath)
  for(let i=0; i<muls.length; i++) {
    await insertDoc(muls[i], newdb)
    if(i%10 == 0) console.log(i)
  }

}
function insertDoc(doc, db){
  return new Promise((resolve,reject)=>{
    db.insert(doc, (err, newdoc)=>{
      if(err) reject(err)
      else resolve(newdoc)
    })
  })
}

function dbtest(){
  let fpath = "./db2/here/ok"
  let db = getDB(fpath)
}
function dotest(){
  let db = getDB(pagewordsdbpath)
  db.find({},(err,docs)=>{
    for(let i=0; i<docs.length; i++){
      docs[i].filepath = docs[i].filepath.replace("/home/palitranslation/Desktop/palisearch", ".")
      delete docs[i]._id

      if(i == docs.length-1){
        let fpath = "./db2/ff.db"
        let fdb = getDB(fpath)
        fdb.insert(docs, (err, newdocs)=>{
        })
      }
    }
  })
}
function task(){
  let db = getDB(searchhistorydbpath2)
  db.find({}, (err, docs)=>{
    
    let slistdb = getDB(shistorylistdbpath)
    //return
    
    //for every history item, create a doc in the historylist
    //then with that id, create a dbfile with filelist in it
    let docindex = 0
    handleDoc(docindex)

    function handleDoc(docindex){
      if(docindex < docs.length){
        let doc = docs[docindex]
        
        //now delete filelist and id
        //delete doc.filelist

        let newdoc = {
          note: doc.note,
          searchterm: doc.searchterm,
          searchtype: doc.searchtype,
          timestamp: doc.timestamp
        }

        slistdb.insert(newdoc, (err, newdoc2)=>{
          if(newdoc2) {

            //then make a dbfile with the docid
            let filepath = path.join(shistoryfolder, newdoc2._id)
            let fdb = getDB(filepath)

            let filelist = doc.filelist
            if(filelist){
              for(let i=0; i<filelist.length; i++){
                if(doc.searchtype == "pagebypage")filelist[i] = filelist[i].replace("/home/palitranslation/Desktop/palisearch", ".")
                else if(doc.searchtype == "wordlist"){
                  filelist[i].filepath = filelist[i].filepath.replace("/home/palitranslation/Desktop/palisearch", ".")
                }
              }
            }
            
            fdb.insert({filelist: doc.filelist ? doc.filelist:[]}, (err, newdoc3)=>{
              if(newdoc3){
                docindex++
                handleDoc(docindex)
              }
              else console.log("sth is wrong in inserting filelist for "+doc._id)
            })

            
          }
          else console.log("sth is wrong in updating for "+doc._id)
        })
      }
      else {
        console.log("finished!")
      }
    }
  })
}

//----------------

function attachListners(){
  d3.select("#resultbtn").on("click", async function(){ await handleAllPagesPaliInput()})
  
  document.querySelector("#paliinput").onkeydown = (e)=>{
    if(e.key == "Enter") handleAllPagesPaliInput()
  }

  document.onkeydown = (e)=>{
    //if(e.key === 'Escape') UIM.hideAllFloatings()

    //set ctrl+n for opening new window
    //else 
    if(e.ctrlKey && e.key == "n"){ 
      let attributes = null
      console.log("new window")
      ipcRenderer.send("opennewwindow",attributes)
    }
  }

}
async function loadPagewordsDatabase(){
  let categories = ["mul","att","tik","ann"]

  pagewordsDocs = [] //reset docs
  
  for(let c of categories){
    let dbpath = './db2/'+c+"words.db"
    let db = getDB(dbpath)

    let docs = await getDocs(db)

    pagewordsDocs.push(...docs)
  }

  function getDocs(db){
    return new Promise((resolve,rejejct)=>{
        db.find({},(err,docs)=>{
          resolve(docs)
        })    
    })  
  }

  return "done"
}

function resetLeftolRigtholSearchDiv(){
  d3.select("#leftol").html("")
  d3.select("#wordgroupdiv").html("")
  
  d3.select("#rightol").html("")
  d3.select("#categorydiv").html("")
  d3.select("#subcategorydiv").html("")
  d3.select("#sengroupdiv").html("")
}

async function handleAllPagesPaliInput(){
  let t0 = performance.now()

  //clear previous result
  resetLeftolRigtholSearchDiv()

  //reset isResultSaved
  isResultSaved = false

  //get input text //single word 
  //let bntext = getBnText()
  let bntext = document.querySelector("#paliinput").value.trim()
  if(bntext.length <= 0) return 

  //get search option
  let option = getSearchOption()

  //show message
  d3.select("rightol").html("সার্চ চলছে. <br>একটু অপেক্ষা করুন ...")

  //get filelist
  if(pagewordsDocs.length <= 0){
    d3.select("#rightol").html("ডাটাবেজ লোড হচ্ছে। একটু অপেক্ষা করুন ...")
    await loadPagewordsDatabase()
    d3.select("#rightol").html("ডাটাবেজ লোড হয়েছে।")
  }
  
  //then start processing
  await processPagewordsDocsNew()
  
  async function processPagewordsDocsNew(){
    let bnwords = bntext.split(" ")
    if(bnwords.length>1)  await preparePageByPageSearch(bnwords)
    else await prepareSingleWordSearch(bntext)
  }
}

/**
 * 
 * @param {*} filtereddocs 
 * @param {*} bntext 
 * @returns wordlist {word:[filepath,...]}
 */
function getFilteredWordlist(filtereddocs, bntext){
  let wordlist = {}
  /**
   * let wordlist = {
   *  word1: [filepath, filepath, ...],
   *  word2: [...]
   * }
   */
  for(let fdoc of filtereddocs){
    let pagewords = fdoc.pagewords.filter(dp=>dp.includes(bntext))
    for(let fword of pagewords){
      //check if fword already in wordlist
      if(fword in wordlist) wordlist[fword].push(fdoc.filepath)
      else wordlist[fword] = [fdoc.filepath]
    }
  }
  return wordlist
  
}

async function prepareSingleWordSearch(bntext){
  let filtereddocs = pagewordsDocs.filter(doc => doc.pagewords.find(ff => ff.includes(bntext)))
  let wordlist = getFilteredWordlist(filtereddocs,bntext)
  let groupnum = getNumberOfGroups(Object.keys(wordlist).length, WORDNUM)
  showButtonsNew("#wordgroupdiv", groupnum, wordlist, bntext)
}

async function getFilteredFilelist(bnwords){
  let filtereddocs = pagewordsDocs.filter(doc => bnwords.every(bw=>doc.pagewords.find(dp=>dp.includes(bw))))
  let filelist = filtereddocs.map(fd => fd.filepath)
  return filelist
} 

async function preparePageByPageSearch(bnwords){
  let filelist = await getFilteredFilelist(bnwords)
  //find categories
  d3.select("#categorydiv").html("") //reset
  let groupcatobjs = await getGroupedCatFilelist(filelist)
  showCatButtons(groupcatobjs, bnwords)
}

function showCatButtons(groupcatobjs, bnwords){
  let catlabels = ["মূল","অর্থকথা","টীকা","অন্যান্য"]
  let cattags = ["mul","att","tik","ann"]

  d3.select("#categorydiv").selectAll("button")
      .data(catlabels)
      .enter()
      .append("button")
      .classed("catbutton",true)
      .attr("tag",function(d,i){return cattags[i]})
      .attr("num",function(d,i){return groupcatobjs[cattags[i]].length})
      .html(function(d,i){
        return d+" <span style='font-weight:bold;'>"+groupcatobjs[cattags[i]].length+"</span>"
      })
      .on("click", async function(d,i){
        setElementSelected(this, "catbtnselected")
        
        //get subcategory file list
        let cattag = this.getAttribute("tag")  
        let catfiles = groupcatobjs[cattag]

        await showSubcatButtons(cattag,catfiles, bnwords)

      })
    
    clickFirstResultChild("categorydiv")

}


function areSeriallyPositioned(sentence, words){
  let wordindexes = []

  for(let i=0; i<words.length; i++){
    let index = sentence.indexOf(words[i])
    if(index == -1) return false

    if(i == 0) wordindexes.push(index)
    else{
      let difference = index - wordindexes[i-1]
      if(difference <= 0) return false
    }
  }
  return true
}

/**
 * 
 * @param {*} filepath 
 * @param {*} bnwords 
 * @returns fndocs filtered pagedocs
 */
function getFilteredParaDocs(filepath, bnwords){
  let db = getDB(filepath)
  return new Promise((resolve,reject)=>{
    db.find({},(err,ndocs)=>{
      let fndocs = ndocs.filter(ndoc=>bnwords.every(bnword=>ndoc.content.includes(bnword)))

      let div = document.createElement("div")
      
      for(let i=0; i<fndocs.length; i++){
        let content = fndocs[i].content 
        div.innerHTML = content
        fndocs[i].content = div.innerText
      }
      resolve(fndocs)
    })
  })
  
}

function getSearchOption(){
  let option = "startswith" //default
  let checkboxes = document.querySelectorAll(".option")
  let cbincludes = [...checkboxes].filter(cb => cb.checked == true && cb.value == "includes")
  let cbendswith = [...checkboxes].filter(cb => cb.checked == true && cb.value == "endswith")
  let cbstartswith = [...checkboxes].filter(cb => cb.checked == true && cb.value == "startswith")
  if(cbincludes.length > 0) option = "includes"
  else if(cbendswith.length > 0 && cbstartswith.length > 0) option = "startends"
  else if(cbendswith.length > 0) option = "endswith"
  
  return option
}


function showButtonsNew(divid,groupnum, wordlist,bntext){
  let dataarray = [...Array(groupnum+1).keys()].slice(1) 
  let wordlistkeys = Object.keys(wordlist).sort((a,b)=>a.localeCompare(b, "bn"))

  d3.select(divid).selectAll("button")
    .data(dataarray)
    .enter()
    .append("button")
    .attr("index",function(d){return d})
    .text(function(d){return d})

    //on click show the tabwordlist
    .on("click",function(i){
       setElementSelected(this, "wbtnselected")
       //get the number 
       let tabindex = parseInt(this.getAttribute("index"), 10)
       let tabwordlist = getListForTab(tabindex-1, wordlistkeys, WORDNUM)
       showTabWordsNew(tabwordlist, wordlist,bntext)
     })

    let firstbutton = document.querySelector(divid).firstChild
    if(firstbutton && firstbutton.tagName == "BUTTON") firstbutton.click()
}


function getListForTab(tabindex, list, NUM){
  let findex = tabindex * NUM
  let lindex = (tabindex+1) * NUM //excluding // as will be used in slice()
  if(lindex >= list.length) lindex = list.length
  return list.slice(findex, lindex)
}
function showTabWordsNew(tabwordlist, wordlist, bntext){
  let leftol = d3.select("#leftol").html("") //reset
   
  if(tabwordlist.length == 0) return
  leftol.selectAll("li")
    .data(tabwordlist)
    .enter()
    .append("li")
    .attr("index", function(d,i){return i})
    .classed("wordli", true)
    .html(function(d){return d})

    .on("click", async function(e, i){
      setElementSelected(this, "wordliselected")

      let index = this.getAttribute("index")

      clearRightDiv()
      let word = tabwordlist[index]
      let filelist = wordlist[word]

      //reset catdiv
      d3.select("#categorydiv").html("") //reset
      let groupcatobjs = await getGroupedCatFilelist(filelist)
      showCatButtons(groupcatobjs, [word])
    })

  let firstli = document.querySelector("#leftol").firstChild
  if(firstli) firstli.click()
}

function clickFirstResultChild(divid){
  let children = document.querySelector("#"+divid).childNodes
  for(let i=0; i<children.length; i++){
    let num = parseInt(children[i].getAttribute("num"), 10)
    if(num > 0) {
      children[i].click()
      break 
    }
    
  }
}
async function showSubcatButtons(cattag, catfiles, bnwords){
  let subcatdivid = "subcategorydiv"
  d3.select("#"+subcatdivid).html("") //reset
  d3.select("#sengroupdiv").html("")
  d3.select("#rightol").html("")//

  let subcatdata = ["বিনয়","সুত্র","অভিধর্ম"]
  let subcattagdata = ["vin","sut","abh"]

  if(cattag == "ann"){
    subcatdata = ["বি.মার্গ","ব্যাকরণ","অন্যান্য"]
    subcattagdata = ["vis","bya","ann"]
  }

  let scfileobjs = await getGroupedSubcatFilelist(cattag,catfiles)
  d3.select("#subcategorydiv").selectAll("button")
    .data(subcatdata)
    .enter()
    .append("button")
    .classed("catbutton",true)
    .attr("tag",function(d,i){return subcattagdata[i]})
    .attr("num",function(d,i){return scfileobjs[subcattagdata[i]].length})
    .html(function(d,i){
      return d+" <span style='font-weight:bold;'>"+scfileobjs[subcattagdata[i]].length+"</span>"
    })
    .on("click", async function(d,i){
      setElementSelected(this, "subcatbtnselected")
      let subcattag = this.getAttribute("tag")
      
      //show filegroupbuttons
      let groupnum = getNumberOfGroups(scfileobjs[subcattag].length, FILENUM)
      showFilegroupButtons(groupnum, "sengroupdiv", scfileobjs[subcattag], bnwords)
    })

    clickFirstResultChild(subcatdivid)
}



function showFilegroupButtons(groupnum, subcatdivid, scobjfilelist, bnwords){
  d3.select("#"+subcatdivid).html("") //reset
  //create an array of numbers, to be used on button text
  let dataarray = [...Array(groupnum+1).keys()].slice(1) 

  d3.select("#"+subcatdivid).selectAll("button")
    .data(dataarray)
    .enter()
    .append("button")
    .attr("index",function(d){return d})
    //.attr("num",function(d,i){return scfilelist[subcattagdata[i]].length})
    .text(function(d){return d})
    .on("click", async function(i){
      setElementSelected(this, "senbtnselected")
      d3.select("#rightol").html("") //reset senlist

      //get the number 
      let tabindex = parseInt(this.getAttribute("index"), 10)
      scobjfilelist.sort((a,b)=>a.pageid.localeCompare(b.pageid, "en", {numeric:true}))
      
      //separate only filelist
      let scfilelist = scobjfilelist.map(w => w.filepath)
      let tabfilelist = getListForTab(tabindex-1, scfilelist, FILENUM)

      let tabsenlist = await getTabSenList(tabfilelist, bnwords)
      if(tabsenlist.length <= 0){
        //click on the next sibling
        let nextbutton = this.nextElementSibling
        if(nextbutton && nextbutton.tagName == "BUTTON") nextbutton.click()
       
      }
      else showTabSentences(tabsenlist, bnwords)
    })

  let firstbutton = document.querySelector("#"+subcatdivid).firstChild
  if(firstbutton && firstbutton.tagName == "BUTTON") firstbutton.click()
}

async function getTabSenList(tabfilelist, bnwords){
  
  //get tab sentences
  let tabsenlist = []

  for(let tf of tabfilelist){
    let filepath = tf.filepath
    let cat = tf.cat
    let subcat = tf.subcat

    //get bookname and pagename
    let {booktitle,bookid,pageid} = getBookTitle(filepath)
    let pagetitle = getPageTitle(bookid, pageid)
    let paradocs = await getFilteredParaDocs(filepath, bnwords)

    for(let pdoc of paradocs){
      let sentences = textToSentences(pdoc.content)
      sentences = sentences.filter(s => s && areSeriallyPositioned(s, bnwords))
      
      for(let sen of sentences){
        tabsenlist.push({
          sentence: sen, filepath:filepath, booktitle:booktitle, pagetitle:pagetitle,
          paraid: pdoc.paraid, paradocid:pdoc._id,category:cat, subcategory:subcat
        })
      }
      
    }
      
  }

  return tabsenlist
}
function textToSentences(text){
  const splitters = [';',';','‘','’','।','॥','!','?','–',"–"]
  let sentences = splitMulti(text, splitters)
  sentences =  sentences.map(s=> s.trim()).filter(e => e) //filter and keep only those that return true, excluding null
  return sentences

  function splitMulti(str, tokens, tempSplitter="_"){
    //var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tokens[i]+tempSplitter)
    }
    str = str.split(tempSplitter)
    return str
}
}
function showTabSentences(tabsenlist, bnwords){
  let rightol = d3.select("#rightol").html("") //reset
  if(tabsenlist.length == 0) return
  //let sentencelist = tabsenlist.map(t=>t.sentence)
  //let pagetitlelist = 
  rightol.selectAll("li")
    .data(tabsenlist)
    .enter()
    .append("li")
    .attr("index", function(d,i){return i})
    .classed("senli", true)
    .html(function(d,i){return getInnerHTML(d.sentence, bnwords)})

    //add span to html for onclick link copying 
    .append("span")
    .classed("ppsspan", true)
    .html(function(d,i){return " "+ d.booktitle+" => "+d.pagetitle})

    //handle onclick on the span
    .on("click",function(d,i){
      let index = parseInt(this.parentElement.getAttribute("index"))
      let senobjstring = JSON.stringify(tabsenlist[index])
      //copy filepath to clipboard
      electron.clipboard.writeText(senobjstring)
    })
}

function getBookTitle(filepath){
  let fp = filepath.replace("./db2/pages/","")
  fp = fp.split("/")
  let pageid = fp[fp.length-1]
  let bookid = pageid.slice(0, -2)
  let booktitle = ""
  if(bookidlist.includes(bookid)){
    let bookindex = bookidlist.indexOf(bookid)
    booktitle = booktitlelist[bookindex]
  }
  return {booktitle:booktitle,bookid:bookid,pageid:pageid}
}



function getInnerHTML(sentence,bnwords){
  let words = sentence.split(" ")
  let matches = words.filter(w => bnwords.find(bword => w.includes(bword)))
  let uniquematches = [...new Set(matches)]
  
  uniquematches.forEach(um => sentence = sentence.replaceAll(um, "<b>"+um+"</b>"))
  
  return sentence
}

function getGroupedSubcatFilelist(cattag, catfiles){
  return new Promise((resolve, reject)=>{
    let obj = {vin:[],sut:[],abh:[]}

    let subcatdata = ["বিনয়","সুত্র","অভিধর্ম"]
    let subcattagdata = ["vin","sut","abh"]

    if(cattag == "ann"){
      obj = {vis:[],bya:[],ann:[]}
      subcatdata = ["বি.মার্গ","ব্যাকরণ","অন্যান্য"]
      subcattagdata = ["vis","bya","ann"]
    }
    
    for(let i=0; i<catfiles.length; i++){
      let dbpath = catfiles[i].filepath
      let category = catfiles[i].cat
      let subcategory = catfiles[i].subcat
      let fp = dbpath.split("/")
      let pageid = fp[fp.length-1]

      if(subcategory == "vinaya") obj.vin.push({pageid:pageid,filepath:catfiles[i]})
      else if(subcategory == "sutta") obj.sut.push({pageid:pageid,filepath:catfiles[i]})
      else if(subcategory == "abhidhamma") obj.abh.push({pageid:pageid,filepath:catfiles[i]})
      else if(subcategory == "vismag") obj.vis.push({pageid:pageid,filepath:catfiles[i]})
      else if(subcategory == "byakarana") obj.bya.push({pageid:pageid,filepath:catfiles[i]})
      else if (category == "anno") obj.ann.push({pageid:pageid,filepath:catfiles[i]})

      if(i == catfiles.length-1) resolve(obj)
    }
  })
}

function getGroupedCatFilelist(filelist){
  return new Promise((resolve, reject)=>{
    let obj = {mul:[],att:[],tik:[],ann:[]}
    
    for(let i=0; i<filelist.length; i++){
      let dbpath = filelist[i]
      let fp = dbpath.replace("./db2/pages/","")
      fp = fp.split("/")
      let category = fp[0], subcategory = fp[1]


      if(category == "mula") obj.mul.push({cat:category,subcat:subcategory,filepath:dbpath})
      else if(category == "atthakatha") obj.att.push({cat:category,subcat:subcategory,filepath:dbpath})
      else if(category == "tika") obj.tik.push({cat:category,subcat:subcategory,filepath:dbpath})
      else if(category == "anno") obj.ann.push({cat:category,subcat:subcategory,filepath:dbpath})

      if(i == filelist.length-1) resolve(obj)
    }
  })
}

/**
 * membnum: number of items in every group
 * listlength is the length of the mother list
 * returns number of groups as integer.
 */
function getNumberOfGroups(listlength, membnum){
  let division = listlength/membnum
  let modulus = listlength % membnum
  let groupnum = modulus == 0 ? division : Math.trunc(division)+ 1
  return groupnum
}



function setElementSelected(element,selectedclass){
  d3.selectAll("."+selectedclass)
    .classed(selectedclass, false)
  d3.select(element).classed(selectedclass, true)
}

function clearRightDiv(){
  document.querySelector("#categorydiv").innerHTML = ""
  document.querySelector("#subcategorydiv").innerHTML = ""
  document.querySelector("#sengroupdiv").innerHTML = ""
  document.querySelector("#rightol").innerHTML = ""
}

function getDB(dbpath){
  let db

  if(dbpath in dbs) return dbs[dbpath]
  else {
    const db = new Datastore({filename: dbpath})
    db.loadDatabase()
    dbs[dbpath] = db
    return db
  }
}

