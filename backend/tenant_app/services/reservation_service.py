"""Reservation workflow: email the guest when a reservation becomes confirmed."""

import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db import connection, transaction

logger = logging.getLogger('custom_logger')

CONFIRMED = 'Confirm'


def notify_if_confirmed(reservation, previous_status):
    """Send the confirmation email once, when the status changes to Confirm."""
    if reservation.reservation_status != CONFIRMED or previous_status == CONFIRMED or not reservation.email:
        return
    restaurant = getattr(getattr(connection, 'tenant', None), 'restaurant_name', None)
    transaction.on_commit(lambda: _send_confirmation(reservation, restaurant))


def _send_confirmation(reservation, restaurant):
    table_number = reservation.table_number if reservation.table_number is not None else '- - -'
    booking_date = reservation.date.strftime('%d-%m-%y') if reservation.date else ''
    regarding = ''
    if restaurant is not None:
        regarding = f'{restaurant.restaurant_name}\n {restaurant.mobile_number}\n {restaurant.address}'
    message = (
        f'Hello {reservation.name},\n\n'
        'We are pleased to inform that your booking has been Confirmed.\n\n'
        ' Your booking details : \n'
        f' Guest Name : {reservation.name}\n'
        f' Number of Guest : {reservation.number_of_person}\n'
        f' Table Number : {table_number}\n'
        f' Date : {booking_date} \n'
        f' Time : {reservation.time} \n\n'
        f' Regarding : \n {regarding}\n\n'
        'We are delighted to serve you,\nHope you will enjoy your visit !!\n\n Thanking you..!!'
    )
    try:
        send_mail('Reservation confirmation detail', message, settings.DEFAULT_FROM_EMAIL, [reservation.email])
    except Exception:
        logger.exception('reservation confirmation email failed for reservation %s', reservation.pk)
