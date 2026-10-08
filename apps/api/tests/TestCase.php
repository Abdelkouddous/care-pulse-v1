<?php

namespace Tests;

use App\Models\Admin;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * @property Clinic $clinic
 * @property Specialty $specialty
 * @property Doctor $doctor
 * @property User $patient
 * @property Admin $admin
 */
#[\AllowDynamicProperties]
abstract class TestCase extends BaseTestCase
{
    public ?Clinic $clinic = null;
    public ?Specialty $specialty = null;
    public ?Doctor $doctor = null;
    public ?User $patient = null;
    public ?Admin $admin = null;
}
