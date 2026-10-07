<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use BelongsToTenant, HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'clinic_id',
        'scheduled_at',
        'status',
        'whatsapp_status',
        'whatsapp_message_id',
        'whatsapp_last_sent_at',
        'whatsapp_confirmed_at',
        'reason',
        'notes',
        'cancellation_reason',
        'cancelled_by',
        'consultation_fee_cents',
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
            'whatsapp_last_sent_at' => 'datetime',
            'whatsapp_confirmed_at' => 'datetime',
            'consultation_fee_cents' => 'integer',
        ];
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class, 'appointment_id');
    }
}
