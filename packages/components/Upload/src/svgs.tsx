const outer = (color: string) => `<path d="M594.944 0l335.12448 341.31968v563.2c0 65.9968-52.50048 119.48032-117.29408 119.48032H209.54624c-64.7936 0-117.2992-53.5296-117.2992-119.48032V119.48032C92.25216 53.48352 144.75776 0 209.55136 0H594.944z" fill="${color}" />`

const image = outer('#36D2AD') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M613.56032 426.68032H278.4256c-10.24 0-18.61632 8.4736-18.61632 18.944V749.056c0 10.4704 8.37632 18.944 18.61632 18.944h335.1296c10.28608 0 18.61632-8.4736 18.61632-18.944V445.62432a18.80576 18.80576 0 0 0-18.61632-18.944z m-37.23776 284.39552H315.66848v-94.7712l55.8592-56.87296 93.08672 94.81216 55.8592-56.92416 55.84896 56.92416v56.87808-0.0512z m-37.23776-151.64416a37.56032 37.56032 0 0 1-37.23264-37.9392c0-20.9408 16.66048-37.93408 37.23264-37.93408 20.57728 0 37.23776 16.99328 37.23776 37.9392 0 20.9408-16.66048 37.93408-37.23776 37.93408z" fill="#FFFFFF" />'
const zip = outer('#D0D8E1') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M516.8384 438.0416h-31.2832c-2.2272 0-3.34848 1.16224-4.46464 2.2784-1.11616 1.11616-1.11616 3.39968-1.11616 5.6832 2.23232 4.5568 3.3536 10.24 3.3536 14.7968v147.9168l3.34848 22.76352c0 2.28352 2.23232 3.39968 3.3536 4.51584 1.11616 0 2.23232 1.16224 2.23232 1.16224l5.5808 3.39968a45.14816 45.14816 0 0 1 29.05088 42.12224v51.2c0 2.28352 1.11616 4.51584 3.34848 4.51584 1.11616 0 1.11616 1.16224 2.23744 1.16224 1.11616 0 2.23232 0 3.34848-1.16224a32.62976 32.62976 0 0 0 13.40416-27.27424V472.15616a31.65184 31.65184 0 0 0-32.39424-34.11456zM376.0896 460.8l-14.52544 51.2a12.288 12.288 0 0 0 2.23232 13.63968c4.46976 4.5568 21.22752 4.5568 25.69216 0 3.2768-3.72736 4.5312-8.82176 3.3536-13.63968L378.3168 460.8h-2.23232z" fill="#FFFFFF" /><path d="M366.0288 453.95968c1.12128-3.39968 3.3536-4.51584 5.58592-4.51584h11.17184c2.23744 0 4.46976 1.11616 5.58592 4.51584l6.7072 26.20416L404.00896 460.8l-13.40928-31.83616v-2.3296H360.448v2.3296L349.27616 460.8l8.9344 21.59616 7.81824-28.3904v-0.0512z" fill="#FFFFFF" /><path d="M354.39616 426.68032l-11.17184 31.84128v4.5568L354.39616 491.52c0.6912 1.41312 1.90976 2.50368 3.39456 3.0208l2.19136 0.37888-4.46976 13.68064a23.64416 23.64416 0 0 0 5.5808 24.99584c4.47488 4.56192 12.288 6.84544 21.22752 6.84544s16.75776-2.28352 21.22752-6.84544a24.2944 24.2944 0 0 0 6.656-21.4528l-5.58592-18.34496c0.78848 0 1.536-0.512 1.95584-1.16224l0.32256-1.11616 14.52544-28.4416a3.49184 3.49184 0 0 0 0.7424-3.11808l-0.7424-1.39264-14.52544-31.88736h35.74784a33.0496 33.0496 0 0 1 33.23392 29.37344L476.16 460.8v164.95616c0 8.79616 4.93056 15.9232 11.96032 19.92192l11.4944 5.12a32.86016 32.86016 0 0 1 22.016 26.99776l0.32768 4.88448v51.2c0 17.6896-12.19584 31.65184-28.85632 33.8432l-4.6592 0.27648H298.5472a33.0496 33.0496 0 0 1-33.23392-29.4144l-0.2816-4.70528V460.8c0-17.6896 12.19584-31.65184 28.86144-33.8432l4.65408-0.27648h55.85408z m16.75264 284.39552H359.9872c-3.3536 0-5.58592 2.32448-5.58592 5.72416 0 2.74432 1.39264 4.74624 3.72224 5.44768l1.86368 0.2304h11.16672c3.3536 0 5.58592-2.2784 5.58592-5.67808 0-2.74432-1.39264-4.74624-3.72224-5.44768l-1.86368-0.2304v-0.0512z m33.51552-11.35616h-11.17184c-3.34848 0-5.5808 2.32448-5.5808 5.72416 0 2.69824 1.39264 4.70016 3.71712 5.39648l1.86368 0.2816h11.17184c3.34848 0 5.5808-2.3296 5.5808-5.6832 0-2.7904-1.39264-4.74112-3.71712-5.44256l-1.86368-0.27648z m-33.51552-11.36128H359.9872c-3.3536 0-5.58592 2.28352-5.58592 5.6832 0 2.74432 1.39264 4.74624 3.72224 5.44256l1.86368 0.23552h11.16672c3.3536 0 5.58592-2.28352 5.58592-5.6832 0-2.74432-1.39264-4.74624-3.72224-5.39648l-1.86368-0.2816z m33.51552-11.40224h-11.17184c-3.34848 0-5.5808 2.3296-5.5808 5.72416 0 2.70336 1.39264 4.70528 3.71712 5.4016l1.86368 0.27648h11.17184c3.34848 0 5.5808-2.2784 5.5808-5.67808 0-2.74432-1.39264-4.74624-3.71712-5.44256l-1.86368-0.2816zM371.1488 665.6H359.9872c-3.3536 0-5.58592 2.2784-5.58592 5.6832 0 2.7392 1.39264 4.74112 3.72224 5.44256l1.86368 0.2304h11.16672c3.3536 0 5.58592-2.23232 5.58592-5.67808 0-2.69824-1.39264-4.70016-3.72224-5.39648L371.1488 665.6z m33.51552-11.35616h-11.17184c-3.34848 0-5.5808 2.23232-5.5808 5.67808 0 2.69824 1.39264 4.70016 3.71712 5.39648l1.86368 0.2816h11.17184c3.34848 0 5.5808-2.2784 5.5808-5.6832 0-2.7392-1.39264-4.74112-3.71712-5.44256l-1.86368-0.2304z m-33.51552-11.40224H359.9872c-3.3536 0-5.58592 2.2784-5.58592 5.67808 0 2.74432 1.39264 4.74624 3.72224 5.44256l1.86368 0.2816h11.16672c3.3536 0 5.58592-2.3296 5.58592-5.72416 0-2.70336-1.39264-4.70528-3.72224-5.4016l-1.86368-0.27648z m33.51552-11.36128h-11.17184c-3.34848 0-5.5808 2.28352-5.5808 5.6832 0 2.74432 1.39264 4.74624 3.71712 5.39648l1.86368 0.2816h11.17184c3.34848 0 5.5808-2.28352 5.5808-5.6832 0-2.74432-1.39264-4.74624-3.71712-5.44256l-1.86368-0.23552z m-33.51552-11.40224H359.9872c-3.3536 0-5.58592 2.3296-5.58592 5.6832 0 2.7904 1.39264 4.74112 3.72224 5.44256l1.86368 0.27648h11.16672c3.3536 0 5.58592-2.32448 5.58592-5.72416 0-2.69824-1.39264-4.70016-3.72224-5.39648l-1.86368-0.2816z m33.51552-11.35616h-11.17184c-3.34848 0-5.5808 2.2784-5.5808 5.67808 0 2.74432 1.39264 4.74624 3.71712 5.44768l1.86368 0.2304h11.17184c3.34848 0 5.5808-2.2784 5.5808-5.67808 0-2.74432-1.39264-4.74624-3.71712-5.44768l-1.86368-0.2304z m-33.51552-11.40224H359.9872c-3.3536 0-5.58592 2.32448-5.58592 5.72416 0 2.69824 1.39264 4.70016 3.72224 5.39648l1.86368 0.2816h11.16672c3.3536 0 5.58592-2.3296 5.58592-5.6832 0-2.7904-1.39264-4.74112-3.72224-5.44256l-1.86368-0.27648z m33.51552-11.36128h-11.17184c-3.34848 0-5.5808 2.28352-5.5808 5.6832 0 2.74432 1.39264 4.74624 3.71712 5.44256l1.86368 0.23552h11.17184c3.34848 0 5.5808-2.28352 5.5808-5.6832 0-2.74432-1.39264-4.74624-3.71712-5.39648l-1.86368-0.2816z m-33.51552-11.40224H359.9872c-3.3536 0-5.58592 2.3296-5.58592 5.72416 0 2.70336 1.39264 4.70528 3.72224 5.4016l1.86368 0.27648h11.16672c3.3536 0 5.58592-2.2784 5.58592-5.67808 0-2.74432-1.39264-4.74624-3.72224-5.44256l-1.86368-0.2816zM404.66432 563.2h-11.17184c-3.34848 0-5.5808 2.2784-5.5808 5.6832 0 2.7392 1.39264 4.74112 3.71712 5.44256l1.86368 0.2304h11.17184c3.34848 0 5.5808-2.23232 5.5808-5.67808 0-2.69824-1.39264-4.70016-3.71712-5.39648l-1.86368-0.2816z m-33.51552-11.35616H359.9872c-3.3536 0-5.58592 2.23232-5.58592 5.67808 0 2.69824 1.39264 4.70016 3.72224 5.39648l1.86368 0.2816h11.16672c3.3536 0 5.58592-2.2784 5.58592-5.6832 0-2.7392-1.39264-4.74112-3.72224-5.44256l-1.86368-0.2304z" fill="#FFFFFF" />'
const xls = outer('#1ABF74') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M594.61632 426.82368v0.2304h0.09216V768H566.8352v-0.0512h-83.968 0.04608H399.7696h0.0512-139.91936v-28.3904l0.0512-0.04608v-85.82656h-0.0512v-28.39552h0.0512v-85.82656h-0.09728v-28.39552l0.09216-0.04608V455.168h-0.09216v-28.3904h334.70976l0.04608 0.04608z m-222.62784 226.86208H287.88224v85.82656h84.10624v-85.82656z m83.08224 0h-55.2448v85.82656h55.19872v-85.82656h0.0512z m111.75936 0H482.90816v85.82656H566.784v-85.82656h0.04608z m-194.8416-114.2272H287.88224v85.83168h84.10624v-85.82656z m83.08224 0h-55.2448v85.83168h55.19872v-85.82656h0.0512z m111.75936 0H482.90816v85.83168H566.784v-85.82656h0.04608z m0-84.24448H287.88224v55.808H566.784V455.168l0.04608 0.0512z" fill="#FFFFFF" />'

export default {
    docs: outer('#5895FF') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M427.37664 725.31968V768H259.8144v-42.68032h167.56224zM594.944 640v42.68032H259.8144V640H594.944z m0-85.31968v42.63936H259.8144v-42.63936H594.944z m0-85.36064V512H259.8144v-42.68032H594.944z" fill="#FFFFFF" />',
    java: outer('#424242') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M504.45824 580.608c49.52576 0 90.3424 40.86784 90.3424 92.02176 0 50.45248-40.81664 92.06784-90.3424 92.06784a86.10816 86.10816 0 0 1-51.57376-16.384c-6.05184-4.096-7.35232-12.94336-3.34848-19.08736a13.5424 13.5424 0 0 1 18.75456-3.39456c10.70592 7.44448 23.41376 11.58656 36.16768 11.58656 34.816 0 63.58016-29.32224 63.58016-64.78848 0-35.47136-28.76416-64.7936-63.58016-64.7936-32.768 0-60.1856 25.97376-63.30368 58.6496l-0.32256 6.144c0 50.45248-40.82176 92.06784-90.34752 92.06784-49.52576 0-90.38848-41.61536-90.38848-92.06784 0-50.4576 40.86272-92.02176 90.38848-92.02176 17.408 0 34.11968 4.74624 48.87552 14.2848 6.04672 4.096 8.00256 12.288 3.99872 19.08736a13.5936 13.5936 0 0 1-18.75456 4.096 60.8768 60.8768 0 0 0-34.11968-10.24c-34.816 0-63.58016 29.32224-63.58016 64.7936 0 35.46624 28.76416 64.78848 63.58016 64.78848 34.816 0 63.58016-29.32224 63.58016-64.78848 0-50.4576 40.82176-92.02176 90.3936-92.02176z" fill="#FFFFFF" />',
    jpg: image,
    jpeg: image,
    bmp: image,
    gif: image,
    svg: image,
    png: image,
    webp: image,
    psd: image,
    mp3: outer('#FFC547') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M568.7808 446.464V675.84a27.2384 27.2384 0 0 1-6.79424 18.24768 45.66016 45.66016 0 0 1-17.31584 12.38016 112.64 112.64 0 0 1-20.80256 6.51776c-6.9376 1.43872-13.40416 2.18624-19.40992 2.18624-6.05184 0-12.52352-0.74752-19.40992-2.14016a112.45568 112.45568 0 0 1-20.80768-6.56384 45.70624 45.70624 0 0 1-17.31584-12.38016A27.22816 27.22816 0 0 1 440.08448 675.84c0-6.84032 2.3296-12.89216 6.84032-18.24768a45.70624 45.70624 0 0 1 17.31584-12.38016c6.98368-2.93376 13.91616-5.12 20.80768-6.51776 6.8864-1.4848 13.35808-2.18624 19.4048-2.18624 14.05952 0 26.95168 2.65216 38.63552 8.00768V534.528L388.608 583.07584v145.21856a27.22816 27.22816 0 0 1-6.79936 18.2016 45.66016 45.66016 0 0 1-17.31584 12.38016 112.64 112.64 0 0 1-20.80256 6.56384c-6.9376 1.39776-13.40416 2.14016-19.40992 2.14016-6.05184 0-12.52352-0.69632-19.40992-2.14016a112.50176 112.50176 0 0 1-20.80768-6.51776A45.70624 45.70624 0 0 1 266.752 746.496a27.23328 27.23328 0 0 1-6.84544-18.24768c0-6.79424 2.3296-12.89216 6.84544-18.19648a45.70624 45.70624 0 0 1 17.31072-12.38016c6.98368-2.93376 13.92128-5.12 20.80768-6.56384a94.80192 94.80192 0 0 1 19.4048-2.14016c14.05952 0 26.9568 2.65216 38.63552 7.95648V498.87232a19.87584 19.87584 0 0 1 13.68576-18.84672l167.28576-52.41344c1.80224-0.57856 3.6864-0.86016 5.5808-0.83968 5.4016 0 9.96352 1.90976 13.68576 5.72928 3.77344 3.86048 5.632 8.46848 5.632 13.96224z" fill="#FFFFFF" />',
    mp4: outer('#627CFE') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M519.68 606.62784v66.42176l120.832 73.40032v-213.0432z" fill="#FFFFFF" opacity=".99" /><path d="M534.528 512.13824H282.25024a22.48192 22.48192 0 0 0-22.2976 22.62016v210.52928c0 12.38016 9.91744 22.66624 22.25152 22.66624h252.50816a22.48192 22.48192 0 0 0 22.25152-22.66624v-210.7136a22.62016 22.62016 0 0 0-22.43584-22.43584zM356.2496 719.36v-158.81216L483.328 639.9488 356.2496 719.36z" fill="#FFFFFF" opacity=".99" />',
    pdf: outer('#E94848') + '<path d="M482.95424 375.48032a40.58624 40.58624 0 0 0-40.02816 40.77568c0 27.78624 15.17056 62.32576 31.1808 94.7712-12.56448 39.8336-26.71616 82.47296-44.82048 118.5024-37.0944 14.7968-70.1952 25.8304-90.0608 42.16832a41.70752 41.70752 0 0 0-12.3904 29.9264c0 22.34368 18.06336 40.77568 40.0384 40.77568a39.33184 39.33184 0 0 0 29.27104-12.47232c14.6176-17.82784 31.88736-50.12992 47.29344-79.6416 35.42016-14.19776 72.60672-28.672 108.44672-37.3248 26.1632 21.4528 64.0512 35.65056 95.18592 35.65056 21.96992 0 40.03328-18.38592 40.03328-40.77568a40.58624 40.58624 0 0 0-40.03328-40.72448c-24.99072 0-61.29664 9.07264-89.0368 18.61632a301.3376 301.3376 0 0 1-58.09152-76.98432c10.65984-33.3312 23.04-66.65728 23.04-92.48768a40.58624 40.58624 0 0 0-40.02816-40.77568z m0 24.43776c8.98048 0 16.01024 7.168 16.01024 16.29184 0 12.2368-6.42048 34.816-13.87008 59.01824C475.136 451.67616 466.944 429.056 466.944 416.256c0-9.1648 7.02464-16.29184 16.01024-16.29184v-0.04608z m6.8864 139.5456a323.57376 323.57376 0 0 0 41.5232 53.76c-23.74144 6.6048-46.91968 15.0784-69.82144 23.92064 11.07968-25.36448 19.9168-51.75808 28.29824-77.72672v0.04608z m157.2352 52.12672c8.98048 0 16.01024 7.12192 16.01024 16.29184 0 9.12384-7.02976 16.29184-16.01536 16.29184-18.05824 0-43.65824-8.28416-64.18432-19.87584 23.552-6.79424 49.2032-12.7488 64.18432-12.7488v0.04096zM408.15104 664.576c-11.264 20.48-22.43584 39.56224-30.2592 49.152a15.0784 15.0784 0 0 1-11.02848 4.18816 15.96416 15.96416 0 0 1-16.01024-16.29184c0.03072-4.16256 1.53088-8.18688 4.23424-11.35616 9.40032-7.3984 29.83424-16.29184 53.06368-25.69216z" fill="#FFFFFF" /><path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" />',
    ppt: outer('#FD7541') + '<path d="M930.06848 341.31968h-211.9168c-64.74752 0-123.20768-59.48928-123.20768-125.4912V0l335.12448 341.31968z" fill="#FFFFFF" fill-opacity=".4" /><path d="M415.27808 451.44576c-85.83168 0-155.37152 70.84032-155.37152 158.208 0 87.36256 69.58592 158.208 155.37152 158.208 85.78048 0 155.3664-70.84544 155.3664-158.2592H415.2832v-158.1568z" fill="#FFFFFF" opacity=".4" /><path d="M439.48032 426.7264v158.2592h155.32032c0-87.41376-69.53984-158.2592-155.3664-158.2592h0.04608z" fill="#FFFFFF" />',
    xls,
    xlsx: xls,
    zip,
    rar: zip,
    '7z': zip,
    gz: zip,
    default: outer('#6CCBFF') + '<path d="M935.10167 288.7168h-237.44512c-27.82208-0.6656-50.2272-23.07584-50.92864-50.93376V0l288.37376 288.7168z" fill="#C4EAFF" /><path d="M354.16599 542.78656h89.04192v144.3584a17.47456 17.47456 0 0 0 16.9984 17.01888h101.72928a17.47456 17.47456 0 0 0 16.9984-17.01888v-144.3584h89.0368a7.3728 7.3728 0 0 0 7.63904-5.12c1.1776-3.18464 0.512-6.7584-1.72544-9.30816L522.95703 383.86688a19.10784 19.10784 0 0 0-11.88352-5.12 15.39584 15.39584 0 0 0-11.88864 5.12L348.26263 528.22528a7.58784 7.58784 0 0 0-1.72544 9.30816c1.23904 3.1232 4.2752 5.16608 7.63392 5.12v0.13312z m368.9216 220.8256H299.05431a16.99328 16.99328 0 0 0-15.60064 8.17152 17.04448 17.04448 0 0 0 0 17.63328 16.99328 16.99328 0 0 0 15.60064 8.17152h424.03328a17.01376 17.01376 0 0 0 15.93344-16.98816 17.01376 17.01376 0 0 0-15.93344-16.98816z" fill="#FFFFFF" />'
}

export const start = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">'