### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [3.1.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/3.0.0...3.1.0)

> 10 October 2022
- Added documentation copy task

#### [3.0.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.6.0...3.0.0)

> 25 August 2022
- Get rid of node-sass dependency, replacing it with sass, to make builder work on newer versions of node and python
- updated other dependencies to the latest possible and working with webpack 4.0 and current setup.

#### [2.6.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.5.3...2.5.4)

> 1 July 2022

- Remove support for vue files, remove vue loader, due to issues with dependencies [`5f62bbc7`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/-/commit/5f62bbc7b81ce7d190f820958d266dfd01992b35)

#### [2.5.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.5...2.5.3)

> 9 May 2021

- Fix issues with theme naming [`dd8a00b0`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/-/commit/a8cfffb73cf283f2b5a67f778f1d18b1c1eb8e13)
- Fix issues with aliasing parent theme [`dd8a00b0`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/-/commit/fa6db20a926ea58c8e3e044a80480e4ccc551245)
- Bump packages

#### [2.4.5](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.4...2.4.5)

> 2 February 2021

- Fix collecting xml images when there are images defined for multiple modules [`dd8a00b0`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/-/commit/dd8a00b089c667bd1c399e95bd2a22070e5bcb4e)

#### [2.4.4](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.3...2.4.4)

> 2 October 2020

- Make sure view.xml is correctly inherited [`6774ff4d`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/-/commit/6774ff4d44d55fcd7531ea1c54e14353470528a6)

#### [2.4.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.2...2.4.3)

> 18 September 2020

- Fix switch to new ssh connection data [`#1`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/merge_requests/1)

#### [2.4.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.1...2.4.2)

> 27 August 2020

- Fix collecting of view.xml to not ignore false values [`21e3416`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/21e34164c26b6908e30fa28ddd45de3a8388127d)
- Update changelog [`fe92460`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/fe92460d99e7e9a50689c57d7e71461b0a2b3c2a)
- Release 2.4.2 [`6e0ef3c`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/6e0ef3c6fe261a38382e328c1e443ba38ca2bd2b)

#### [2.4.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.4.0...2.4.1)

> 3 May 2020

- Update dependencies [`d7eb662`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/d7eb6622f02fcff5c4c24bf226886bd70536910b)
- Update changelog [`b934901`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b93490194f7d89a4fd74b068c45b4ed55fce6972)
- Release 2.4.1 [`98e9e8a`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/98e9e8af85adab5fa276dcd333645b1a8c586009)

#### [2.4.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.3.1...2.4.0)

> 3 May 2020

- feat: In cleanCache task, allow to clean cache directly on a local machine as well (instead of through ssh connection) [`#3`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/merge_requests/3)
- Release 2.4.0 [`3391813`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/33918134595d1c0e5b71c2548a38330198f855d7)
- Add support for SSH agent forwarding [`767cce2`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/767cce2344f5c3f322eb1799892bdfea19a04093)

#### [2.3.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.3.0...2.3.1)

> 21 February 2020

- Remove optimization of calc in styles [`3e2db0d`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/3e2db0d10bd583570c2ec77fea64278d2962b34d)
- Release 2.3.1 [`3908ba5`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/3908ba5af84d4ca4cb950027805a90f63bfdef4e)

#### [2.3.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.2.1...2.3.0)

> 20 February 2020

- Remove creation of common package which did more harm then good [`9899702`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/98997022d53f11dc06a528f21402a30829bb9fde)
- Release 2.3.0 [`80ee219`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/80ee2192b5e735451044cd473b0b3d17ed6ce2fa)

#### [2.2.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.2.0...2.2.1)

> 19 February 2020

- Remove redundant git add from lint-staged config [`36062ff`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/36062ff65720b61249e749914bc5295fe633bc5c)
- Release 2.2.1 [`a30c64e`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/a30c64ebfaa7906ccd4511c74589f4ed044fbe2c)

#### [2.2.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.5...2.2.0)

> 19 February 2020

- Add CSS minification, update packages [`b545aeb`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b545aeb6df7dd7643b37c4244188379628ca9ac6)
- Adjust releasing config [`5955a08`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/5955a0816114e4600e63f4b0f3a841fb74efd11c)
- Release 2.2.0 [`24e131e`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/24e131e02c539fa486f1129c5ee4e9e181aee193)

#### [2.1.5](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.4...2.1.5)

> 23 December 2019

- Fix collecting of XML config [`b690872`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b6908725b4a33a48cb49f17a5cb9a414bc011605)
- Release 2.1.5 [`7375e6f`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/7375e6f61783b22b2c294957ee3f6006e08f7c4c)

#### [2.1.4](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.3...2.1.4)

> 20 December 2019

- Release 2.1.4 [`79fac56`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/79fac560e676f2054761376ef23c3a908ed9d6f7)
- Fix project aliases in Sass [`5260300`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/52603007950c59315943202a29c536daef24751b)

#### [2.1.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.2...2.1.3)

> 19 December 2019

- Add support for images defined for multiple modules in view.xml [`34351ce`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/34351cee414915790f59533d6a32151b0e4a83d1)
- Update changelog [`bfc2aaf`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/bfc2aaf18dca291c2a09b7937e8dd8370c8d56e8)
- Release 2.1.3 [`8e0aeb9`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/8e0aeb91321d5c306cbc91d306e5aa1879ad721a)

#### [2.1.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.1...2.1.2)

> 25 November 2019

- Cleanup packages and configs [`0cd1331`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/0cd133108f821640a079f68eba38fceca040726f)
- Prepare release [`aec974a`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/aec974a679d0833fa16cef6c6cf9d68b821a0364)
- Release 2.1.2 [`f12adfb`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/f12adfbfb93ea50e7c3c14b7379f00816c70084b)

#### [2.1.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.1.0...2.1.1)

> 20 November 2019

- Update modules and their configs [`d50b12f`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/d50b12f2f0d5f44fa89b63c1987e7e6eced05640)
- Update changelog [`efa25ea`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/efa25ea6218fdf082ffdda0f647a2067072b097e)
- Release 2.1.1 [`9ae5fd9`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/9ae5fd948d7e173ffa412ae4ff4e3049bd5ce695)

#### [2.1.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/2.0.0...2.1.0)

> 20 November 2019

- Update tools configurations [`cf43cc5`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/cf43cc59e8f7ce83a4403555f74d2a80e1df4fa3)
- Update changelog [`af46e47`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/af46e47a7bf161ba714fb2d802479013cd3b4983)
- Release 2.1.0 [`f90f921`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/f90f921a5dc12ac3a51c980fde2e606058072c42)

### [2.0.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.9.1...2.0.0)

> 21 October 2019

- Update dependencies [`12922b5`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/12922b5796d162216ad63dfa1ecdad024b379e3f)
- Update changelog [`b4bb929`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b4bb9296bdc1a76df98cb2e437e72164d80f9b84)
- Release 2.0.0 [`baf6b43`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/baf6b43e6bfa763cbd8a2da45098dd3810131ad4)

#### [1.9.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.9.0...1.9.1)

> 19 August 2019

- Fix reversed parent chain list for entry points [`1d49a5f`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/1d49a5f2cfe59d4118bdc6341e1772c0f7bd8d81)
- Release 1.9.1 [`fa47d85`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/fa47d855b79a9b5b2c03ad5b270121c973b60794)

#### [1.9.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.8.4...1.9.0)

> 5 June 2019

- Update dependencies [`2779dfd`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/2779dfdfbeca08f6ad17dad622ffac0c38c39806)
- Release 1.9.0 [`e66d1f4`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/e66d1f458b5ea634953c510bb8b45b00bca78d57)
- Remove annoyng logging [`b76211a`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b76211a16a08514b62eb93527654a72248162705)

#### [1.8.4](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.8.3...1.8.4)

> 13 April 2019

- Release 1.8.4 [`2cf5470`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/2cf5470fea59952c578263169df57bf20347ec0a)
- Fix webpack cache patch [`cc7013a`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/cc7013a8cf99c85c63ae9bb5f0f8255934715b8e)

#### [1.8.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.8.2...1.8.3)

> 13 April 2019

- Release 1.8.3 [`5311bb3`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/5311bb329dd8a8b2f0c2a4719eadc5fa3d818043)
- Clean webpack cache during full build [`08e1ad8`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/08e1ad82dd358cf6e0a587fbe6f88143f11a391e)

#### [1.8.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.8.1...1.8.2)

> 13 April 2019

- Release 1.8.2 [`f248b79`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/f248b795e41498b676de55408e306030b926aeef)
- Fix sourcemaps, at least for Chrome [`ea66ae8`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/ea66ae85c939b2018268b982a8f0afac2b343b45)

#### [1.8.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.8.0...1.8.1)

> 13 April 2019

- Release 1.8.1 [`ef96c02`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/ef96c02573358ae1779eec103a680656815e5f6a)
- Cleanup some tasks [`795261d`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/795261d80fa550b9cccfe00d9b67f5fdef7003d1)

#### [1.8.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.7.3...1.8.0)

> 13 April 2019

- Add caching, bring sourcmaps back [`0a84de5`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/0a84de5ae3ce023560bec5a9e32b313d6cff29ab)
- Release 1.8.0 [`4fb0a14`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/4fb0a14870ae893719397e4dd6e7fd5a87b8d860)

#### [1.7.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.7.2...1.7.3)

> 10 April 2019

- Release 1.7.3 [`86f75f2`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/86f75f2bc83da0b92c778b2937b169ae260cafe6)
- Remove logging [`d7efa68`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/d7efa68026ecf7eb808fed932cadb7dac40b43f6)

#### [1.7.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.7.1...1.7.2)

> 9 April 2019

- Make CSS optimizations safer [`89ad960`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/89ad96019cf8553fd7bb3da49d8a0703d031bf82)
- Release 1.7.2 [`e979841`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/e979841a4e09f13f9a48cb0e4a04dafcca58486d)

#### [1.7.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.7.0...1.7.1)

> 4 April 2019

- Release 1.7.1 [`b8f67bb`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b8f67bb9b0644236f69a2ec6e2bbcb3f5816282c)
- Fix images configuration parsing from XML [`7e7924f`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/7e7924f95917e2a916ef993f3c8ef54c97976e1a)

#### [1.7.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.6.0...1.7.0)

> 3 April 2019

- Add CSS minification for better results then Magento provides [`b28de11`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b28de11fa36c44afbfbcddf62a409233c5da6643)
- Release 1.7.0 [`c6f4a37`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/c6f4a37f60b603da068fe5bfbe26c44cdaa7a7e5)

#### [1.6.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.5.0...1.6.0)

> 3 April 2019

- Release 1.6.0 [`8ab72f0`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/8ab72f0ae65f6f526ef6b98b5b67a41e3cc2a5f2)
- Increase the number of required chunks for common bundle to 6 [`1ddbffc`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/1ddbffc2c2de3dcfd3cc1d95d2bbf2c1aaff2c72)

#### [1.5.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.4.2...1.5.0)

> 1 April 2019

- Add configuration for linters [`51fc3a0`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/51fc3a0d373b5656bb647de8136d6dcfe0e3a84e)
- Release 1.5.0 [`b5b416d`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/b5b416d0cd181dbad763e2da09bbd5c0541d26e0)

#### [1.4.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.4.1...1.4.2)

> 29 March 2019

- Fix building errors [`892bba7`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/892bba71cd1fbeea8180e78dce60210385691a8a)
- Release 1.4.2 [`af1bf68`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/af1bf68b3a5db62950e1e83003fda3b634c50464)

#### [1.4.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.4.0...1.4.1)

> 29 March 2019

- Add support for SkipUnchangedPlugin, clean up [`7444532`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/74445321aaef0de6eab9f7415b636cf69c54efea)
- Release 1.4.1 [`aa52d67`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/aa52d675e1d9438217088d38d95dc5397a2d1496)

#### [1.4.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.3.1...1.4.0)

> 20 March 2019

- Add support for common bundle [`37c3ee9`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/37c3ee9f0073b964a05323d3afaef159e8c0b2b0)
- Release 1.4.0 [`fd7d884`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/fd7d8849acd2fcc27e16c95969b2f37d2c5e5672)

#### [1.3.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.3.0...1.3.1)

> 28 February 2019

- Update packages [`fcc4354`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/fcc4354f082fafe1eeb48960a5f806107dad9f34)
- Add support for extensible webpack configuration [`e8921bd`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/e8921bdb016f36d5c24d6c684c8ef37bbcf2f524)
- Update docs [`c6edad8`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/c6edad83c5d007961e9bd8cb69b971562e719eaf)

#### [1.3.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.2.0...1.3.0)

> 18 January 2019

- Change view.xml generation for SCSS [`8c8b79b`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/8c8b79b4ff875baf44f99db9beed6b2a27c72d2e)
- Release 1.3.0 [`5d48b9d`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/5d48b9de61fbe629aa42ff239b307619f0ac716d)

#### [1.2.0](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.5...1.2.0)

> 17 January 2019

- Add escaping of view.xml data for SCSS [`1fa3d10`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/1fa3d1058224116bda6421cd14a809d1c0f4b353)
- Release 1.2.0 [`ce9deee`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/ce9deee2830bd85d09d7635983e0171424ab0d59)

#### [1.1.5](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.4...1.1.5)

> 17 January 2019

- Release 1.1.5 [`55f03dd`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/55f03dd6cf3715b11a89bc2aeeb37d27a5f798a9)
- Move release-it configuration to package.json [`9b707d2`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/9b707d247821ece205201fcc3bfa83dae5cff30d)

#### [1.1.4](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.3...1.1.4)

> 17 January 2019

- Add missing dependencies [`fb99be1`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/fb99be13d8439818d55bacc73f9e1a8fb1ab5e06)
- Small cleanup [`17974f9`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/17974f9480c6503486ac6c1af91bff23024b96bf)
- Update changelog [`bd993f3`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/bd993f3f61ab1f80dd4be599da5708dfaa2bf868)

#### [1.1.3](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.2...1.1.3)

> 17 January 2019

- Update changelog [`f77b5e8`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/f77b5e815e1241ac916d01985918487852779db6)
- Release 1.1.3 [`7b78abb`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/7b78abb5151c14c23397cf7e3093c93f9a4e502e)
- Add missing current theme to view.xml paths [`d4750f2`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/d4750f23ebd4c4fd13a10329794b6fb76a6877a8)

#### [1.1.2](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.1...1.1.2)

> 17 January 2019

- Fix view.xml parsing for some cases [`257e19a`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/257e19af573b42bd620d0d4310b1efea149ec5a6)
- Update changelog [`c0853d5`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/c0853d5d380bd618671e8184d28cbaaffff2aac5)
- Release 1.1.2 [`ac94573`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/ac94573c515f0e43f64b0b158b1bd7f950d12675)

#### [1.1.1](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/compare/1.1.0...1.1.1)

> 15 January 2019

- Add automatic changelog generation [`53654fe`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/53654fe92b043d60114b1bb20d55df254d3c09e7)
- Release 1.1.1 [`cd725d2`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/cd725d207a8ffaa244670cd966af1e62ac2650aa)
- Add missing task to build [`d7f6f98`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/d7f6f989c85c9808abf33e0fb86a98862fa2f780)

#### 1.1.0

> 15 January 2019

- Initial commit [`4a5f9cd`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/4a5f9cd27028af8577b9c496c6a30383bb08a38f)
- Update dependencies [`236c8ca`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/236c8ca6195c90b244b2f4a5b959f9a865af9233)
- Improve automatic cache cleaning [`22a64f9`](https://gitlab.creativestyle.pl/m2c/magesuite-frontend-builder/commit/22a64f9c612bd117e973287850fd24e8df2057ef)
