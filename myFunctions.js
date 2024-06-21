$(document).ready(function() {
    console.log("Document is ready");

    // Load properties data
    $.getJSON("data.json", function(data) {
        console.log("Data loaded successfully", data);
        var tableBody = $('#flats');
        $.each(data, function(key, property) {
            var row = $('<tr></tr>');
            row.append($('<td></td>').text(property.city));
            row.append($('<td></td>').text(property.dital));
            row.append($('<td></td>').text(property.price + ' ل.س'));

            var detailsCell = $('<td class="details"></td>');
            var checkbox = $('<input type="checkbox" class="details-checkbox">');
            var extraDetails = $('<div class="extra-details" style="display: none;"></div>');
            extraDetails.append('<div class="details-row">' +

                                '<div class="details-cell">المنطقة: ' + property.aria + '</div>' +
                                '<div class="details-cell">الطابق: ' + property.floor + '</div>' +
                                '<div class="details-cell">الملكية: ' + property.own + '</div>' +
                                '</div>' +
                                '<div class="details-row">' +

                                '<div class="details-cell">مفروش: ' + property.fur + '</div>' +
                                '<div class="details-cell">البلكون: ' + property.s + '</div>' +
                                '<div class="details-cell">الكراج: ' + property.gra + '</div>' +
                                '</div>' +
                                '<div class="details-row">' +
                                
                                '</div>' +
                                '<div class="details-row images-row">' +
                                '<div class="details-cell"><img src="' + property.image1 + '" alt="Property Image"></div>' +
                                '<div class="details-cell"><img src="' + property.image2 + '" alt="Property Image"></div>' +
                                '<div class="details-cell"><img src="' + property.image3 + '" alt="Property Image"></div>' +
                                '</div>');

            detailsCell.append(checkbox).append(extraDetails);
            row.append(detailsCell);

            var radio = $('<input type="radio" name="select-property" class="select-property">').val(key);
            row.append($('<td></td>').append(radio));
            tableBody.append(row);
        });

        // Toggle extra details on checkbox change
        $(document).on('change', '.details-checkbox', function() {
            var details = $(this).siblings('.extra-details');
            if (this.checked) {
                details.show();
            } else {
                details.hide();
            }
        });

        // Show form on continue button click
        $('#continueBtn').click(function() {
            var selectedProperty = $('input[name="select-property"]:checked');
            if (selectedProperty.length > 0) {
                $('#applicationForm').show();
                generateCaptcha();
            } else {
                alert('قم باختيار عقار أولاً');
            }
        });
        var captchaText = "";

        // Function to generate CAPTCHA
        function generateCaptcha() {
            var charsArray = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var captcha = "";
            for (var i = 0; i < 4; i++) {
                captcha += charsArray[Math.floor(Math.random() * charsArray.length)];
            }
            $('#captcha').text(captcha); // Display the CAPTCHA text
            captchaText = captcha; // Save the generated CAPTCHA text
        }

        // Refresh CAPTCHA on button click
        $('#recaptchBtn').click(function() {
            generateCaptcha();
        });

        // Validate CAPTCHA
        function validateCaptcha() {
            var captchaInput = $('#captchaInput').val();
            if (captchaInput !== captchaText) {
                alert('رمز التحقق غير صحيح.');
            } else {
                alert('رمز التحقق صحيح.');
            }
        }

        // Initial CAPTCHA generation
        $(document).ready(function() {
            generateCaptcha();
        });

        // Initial CAPTCHA generation
        $(document).ready(function() {
            generateCaptcha();
        });

        // Form submission
        $('#applicationForm').submit(function(event) {
            event.preventDefault();

            // Validate form inputs
            var fullName = $('#fullName').val();
            var fullNameRegex = /^[\u0621-\u064A ]+$/; // Arabic characters only
            if (!fullNameRegex.test(fullName)) {
                alert('يرجى إدخال الاسم بشكل صحيح.');
                return;
            }

            var nationalId = $('#nationalId').val();
            var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/; // National ID pattern
            if (!nationalIdRegex.test(nationalId)) {
                alert('الرقم الوطني غير صحيح.');
                return;
            }

            var birthDate = $('#birthDate').val();
            var birthDateRegex = /^(0?[1-9]|[12]\d|3[01])-(0?[1-9]|1[0-2])-(19|20)\d{2}$/; // dd-mm-yyyy pattern
            if (!birthDateRegex.test(birthDate)) {
                alert('يرجى إدخال تاريخ الميلاد بالتنسيق الصحيح (dd-mm-yyyy).');
                return;
            }

            var mobile = $('#mobile').val();
            var mobileRegex = /^09\d{8}$/; // Lebanese mobile number pattern
            if (!mobileRegex.test(mobile)) {
                alert('رقم الهاتف المحمول غير صحيح.');
                return;
            }

            var email = $('#email').val();
            var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Email pattern
            if (!emailRegex.test(email)) {
                alert('البريد الإلكتروني غير صحيح.');
                return;
            }

            

            // Get selected property details
            var selectedPropertyIndex = $('input[name="select-property"]:checked').val();
            var selectedProperty = data[selectedPropertyIndex];
            var propertyDetails = '<p>المدينة: ' + selectedProperty.city + '</p>' +
                                  '<p>التفاصيل: ' + selectedProperty.dital + '</p>' +
                                  '<p>الإيجار الشهري: ' + selectedProperty.price + ' ل.س</p>' +
                                  '<p>المنطقة: ' + selectedProperty.aria + '</p>' +
                                  '<p>الطابق: ' + selectedProperty.floor + '</p>' +
                                  '<p>الملكية: ' + selectedProperty.own + '</p>' +
                                  '<p>البلكون: ' + selectedProperty.s + '</p>' +
                                  '<p>الكراج: ' + selectedProperty.gra + '</p>' +
                                  '<p>مفروش: ' + selectedProperty.fur + '</p>';

            // Show success dialog with property details
            $('#propertyDetails').html('تم إرسال النموذج بنجاح!<br><br>تفاصيل العقار:<br>' + propertyDetails);
            $('#successDialog').dialog({
                modal: true,
                width: 400, // Adjust the width as needed
                buttons: {
                    "تم": function() {
                        $(this).dialog("close");
                        location.reload();
                    }
                }
            });
        });
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    });
});
